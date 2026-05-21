/**
 * POST /api/feedback/upload-url
 *
 * Request:  { files: [{ name, contentType, size }] }
 * Response: { uploads: [{ uploadUrl, key, expiresAt }] }
 *
 * Validates the file metadata (max 3 files, ≤10MB each, content-type
 * must be image/*), then mints one presigned PUT URL per file at
 *   feedback/<userId>/<YYYY-MM-DD>/<ts>-<random>-<sanitised-name>
 * The browser PUTs each file directly to R2 using the returned URL.
 *
 * Per-user key prefix is enforced server-side so a malicious client
 * can't request URLs that overwrite another user's files. The matching
 * /api/feedback route also re-checks the prefix when accepting the
 * submitted keys.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { randomUUID } from 'node:crypto';
import { getPresignedPutUrl, isR2Configured } from '@dexter/core/runtime/r2';
import { getCurrentUser } from '../../../../lib/auth/session';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/** Max bytes per file. Mirrored client-side for UX; enforced here for trust. */
const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB
const MAX_FILE_COUNT = 3;
const ALLOWED_CONTENT_TYPE_PREFIX = 'image/';

interface UploadUrlRequestFile {
  name?: string;
  contentType?: string;
  size?: number;
}

interface UploadUrlRequest {
  files?: UploadUrlRequestFile[];
}

export async function POST(request: NextRequest): Promise<Response> {
  if (!isR2Configured()) {
    return NextResponse.json(
      { error: 'storage_not_configured' },
      { status: 503 },
    );
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  }

  let body: UploadUrlRequest;
  try {
    body = (await request.json()) as UploadUrlRequest;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const files = body.files ?? [];
  if (!Array.isArray(files) || files.length === 0) {
    return NextResponse.json({ error: 'no_files' }, { status: 400 });
  }
  if (files.length > MAX_FILE_COUNT) {
    return NextResponse.json(
      { error: 'too_many_files', max: MAX_FILE_COUNT },
      { status: 400 },
    );
  }

  // Validate each file's metadata before we sign anything. We reject
  // the entire batch on any failure so the client doesn't have to
  // handle partial-success.
  const validated: Array<{ name: string; contentType: string; size: number }> = [];
  for (const f of files) {
    if (!f.name || typeof f.name !== 'string') {
      return NextResponse.json({ error: 'invalid_file_name' }, { status: 400 });
    }
    if (!f.contentType || typeof f.contentType !== 'string') {
      return NextResponse.json({ error: 'invalid_content_type' }, { status: 400 });
    }
    if (!f.contentType.startsWith(ALLOWED_CONTENT_TYPE_PREFIX)) {
      return NextResponse.json(
        { error: 'unsupported_content_type', contentType: f.contentType },
        { status: 400 },
      );
    }
    if (typeof f.size !== 'number' || f.size <= 0) {
      return NextResponse.json({ error: 'invalid_size' }, { status: 400 });
    }
    if (f.size > MAX_FILE_BYTES) {
      return NextResponse.json(
        { error: 'file_too_large', max: MAX_FILE_BYTES },
        { status: 400 },
      );
    }
    validated.push({ name: f.name, contentType: f.contentType, size: f.size });
  }

  // Compose keys + sign URLs in parallel. The shared `now` makes the
  // batch's keys sort together when listing a user's uploads.
  const now = Date.now();
  const date = new Date().toISOString().slice(0, 10);
  const safeUserId = user.id.replace(/[^A-Za-z0-9_-]/g, '_');

  try {
    const uploads = await Promise.all(
      validated.map(async (f) => {
        const safeName = f.name.replace(/[^A-Za-z0-9._-]/g, '_').slice(-100);
        // Per-file random suffix prevents collisions when two files
        // share both timestamp + original name.
        const rand = randomUUID().slice(0, 8);
        const key = `feedback/${safeUserId}/${date}/${now}-${rand}-${safeName}`;
        return getPresignedPutUrl(key, f.contentType);
      }),
    );
    return NextResponse.json({ uploads });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      JSON.stringify({
        level: 'error',
        surface: 'web',
        route: '/api/feedback/upload-url',
        userId: user.id,
        msg: 'presign_failed',
        error: message,
      }),
    );
    return NextResponse.json({ error: 'presign_failed' }, { status: 500 });
  }
}
