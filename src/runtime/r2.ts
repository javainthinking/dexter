/**
 * Cloudflare R2 client — S3-compatible storage for agent-generated
 * deliverables (OfficeCLI .pptx / .docx / .xlsx output).
 *
 * Why R2: keeps the Vercel function bundle slim (no inline blob uploads),
 * gives users durable download URLs that survive function recycling,
 * and the AWS S3 SDK already speaks the protocol.
 *
 * Auth: R2 exposes an S3-compatible endpoint at `R2_ENDPOINT_URL` keyed
 * by `R2_ACCESS_KEY_ID` + `R2_SECRET_ACCESS_KEY`. Region is fixed to
 * "auto" per Cloudflare's docs.
 *
 * Key layout: `users/<userId>/office/<YYYY-MM-DD>/<basename>` so files
 * are partitioned by tenant for both bandwidth accounting and future
 * per-user-retention policies. The date prefix keeps a listing
 * time-sortable without a database index.
 *
 * Download URLs are presigned with a 7-day TTL. R2 buckets default to
 * private, so presigning is the simplest way to hand a user a working
 * link without making the bucket public.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { basename, extname } from 'node:path';
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { logger } from '../utils/logger.js';

let cachedClient: S3Client | null = null;

function getClient(): S3Client | null {
  if (cachedClient) return cachedClient;
  const endpoint = process.env.R2_ENDPOINT_URL;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  if (!endpoint || !accessKeyId || !secretAccessKey) return null;
  cachedClient = new S3Client({
    region: 'auto',
    endpoint,
    credentials: { accessKeyId, secretAccessKey },
    // R2 expects path-style requests when using the s3 endpoint.
    forcePathStyle: true,
  });
  return cachedClient;
}

export function isR2Configured(): boolean {
  return Boolean(
    process.env.R2_ENDPOINT_URL &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      process.env.R2_BUCKET_NAME,
  );
}

const EXT_TO_MIME: Record<string, string> = {
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.pdf': 'application/pdf',
  '.csv': 'text/csv',
  '.txt': 'text/plain',
};

function contentTypeFor(filePath: string): string {
  const ext = extname(filePath).toLowerCase();
  return EXT_TO_MIME[ext] ?? 'application/octet-stream';
}

export interface UploadResult {
  /** Object key inside the R2 bucket. */
  key: string;
  /** Presigned GET URL the user can download from. */
  downloadUrl: string;
  /** ISO 8601 expiry for the presigned URL (defaults to 7 days out). */
  expiresAt: string;
  /** File size in bytes (post-read, for diagnostics). */
  byteLength: number;
}

const DEFAULT_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days — R2 max for presigned GET

/**
 * Upload a local file to R2 under a user-partitioned key and return a
 * presigned download URL. Throws if R2 isn't configured or the
 * filesystem read fails. Callers expecting a CLI-style local fallback
 * should check `isR2Configured()` first.
 */
export async function uploadFileForUser(
  userId: string,
  filePath: string,
  opts: { ttlSeconds?: number; filenamePrefix?: string } = {},
): Promise<UploadResult> {
  if (!isR2Configured()) {
    throw new Error('R2 is not configured (missing R2_* env vars)');
  }
  const client = getClient();
  if (!client) {
    throw new Error('R2 client unavailable despite env vars set');
  }
  const bucket = process.env.R2_BUCKET_NAME as string;
  const bytes = await readFile(filePath);
  const date = new Date().toISOString().slice(0, 10);
  const ts = Date.now();
  // Sanitise userId / basename to stay inside the partition we expect.
  // userId comes from our DB so it's already safe, but defending here
  // means a future caller can't punch out of the per-user prefix.
  const safeUserId = userId.replace(/[^A-Za-z0-9_-]/g, '_');
  const prefix = opts.filenamePrefix ? `${opts.filenamePrefix}-` : '';
  const safeBase = basename(filePath).replace(/[^A-Za-z0-9._-]/g, '_');
  const key = `users/${safeUserId}/office/${date}/${ts}-${prefix}${safeBase}`;

  try {
    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: bytes,
        ContentType: contentTypeFor(filePath),
        // R2 ignores ACL headers; presigned URL is the access mechanism.
      }),
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    logger.error(`[R2] put-object failed for ${key}: ${message}`);
    throw new Error(`R2 upload failed: ${message}`);
  }

  // Presign a GET so the user can download. Presigning PUT would
  // hand back an upload URL — the wrong direction for delivery.
  const { downloadUrl, expiresAt } = await presignDownloadForKey(key, {
    ttlSeconds: opts.ttlSeconds,
  });

  return {
    key,
    downloadUrl,
    expiresAt,
    byteLength: bytes.byteLength,
  };
}

/**
 * Download an R2 object's bytes to a local path. Used to restore office
 * files across chunk boundaries — on Vercel each resume runs in a fresh
 * container with an empty /tmp, so a file created in an earlier chunk must
 * be re-materialised from R2 before the agent can keep editing it or the
 * final drain can upload it.
 */
export async function downloadObjectToFile(key: string, destPath: string): Promise<void> {
  if (!isR2Configured()) throw new Error('R2 is not configured');
  const client = getClient();
  if (!client) throw new Error('R2 client unavailable');
  const bucket = process.env.R2_BUCKET_NAME as string;
  const res = await client.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
  const body = res.Body as { transformToByteArray?: () => Promise<Uint8Array> } | undefined;
  if (!body?.transformToByteArray) throw new Error('R2 get-object returned no body');
  const bytes = await body.transformToByteArray();
  await writeFile(destPath, bytes);
}

export interface PresignedDownloadResult {
  /** Presigned GET URL the user can download from. */
  downloadUrl: string;
  /** ISO 8601 expiry; the URL becomes invalid after this. */
  expiresAt: string;
}

/**
 * Mint a fresh presigned download URL for an object already in R2,
 * identified by its key. Used when re-rendering a past chat session:
 * we persist only the durable object key, then re-sign on read because
 * presigned URLs expire (7-day max) and would 403 if stored verbatim.
 *
 * Throws if R2 isn't configured. Does NOT verify the object exists —
 * a dangling key yields a URL that 404s on GET, which is the correct
 * surface for a since-deleted file.
 */
export async function presignDownloadForKey(
  key: string,
  opts: { ttlSeconds?: number } = {},
): Promise<PresignedDownloadResult> {
  if (!isR2Configured()) {
    throw new Error('R2 is not configured (missing R2_* env vars)');
  }
  const client = getClient();
  if (!client) {
    throw new Error('R2 client unavailable despite env vars set');
  }
  const bucket = process.env.R2_BUCKET_NAME as string;
  const ttl = opts.ttlSeconds ?? DEFAULT_TTL_SECONDS;
  const expiresAt = new Date(Date.now() + ttl * 1000).toISOString();
  const downloadUrl = await getSignedUrl(
    client,
    new GetObjectCommand({ Bucket: bucket, Key: key }),
    { expiresIn: ttl },
  );
  return { downloadUrl, expiresAt };
}

export interface PresignedPutResult {
  /** URL the client PUTs the binary to. */
  uploadUrl: string;
  /** Object key the client should reference when submitting the form. */
  key: string;
  /** ISO 8601 expiry; presigned URLs become invalid after this. */
  expiresAt: string;
}

/**
 * Mint a presigned PUT URL so the browser can upload a file directly
 * to R2 without proxying through our Vercel function. This is the
 * client-upload pattern: server picks the key + signs the URL, browser
 * does the heavy lifting.
 *
 * Why direct: a 10 MB image proxied through a Vercel function would
 * burn ~10 MB of inbound bandwidth and ~10 MB of outbound to R2 per
 * upload, plus tie up the function for the entire transfer. Presigned
 * PUTs cut that to zero — the function does only the signing
 * (sub-millisecond).
 *
 * The browser MUST send the same `Content-Type` it requested when
 * PUT'ing, otherwise R2 returns 403 (signature mismatch). Callers
 * should communicate the expected Content-Type back to the client.
 *
 * Caveat: R2 buckets must have CORS configured to allow PUT from the
 * web origin. Without it the browser request is blocked before R2
 * even sees the signature. See ops/r2-cors.md for the policy we
 * apply (or run `bun run scripts/apply-r2-cors.ts` against a bucket).
 */
export async function getPresignedPutUrl(
  key: string,
  contentType: string,
  opts: { ttlSeconds?: number } = {},
): Promise<PresignedPutResult> {
  if (!isR2Configured()) {
    throw new Error('R2 is not configured (missing R2_* env vars)');
  }
  const client = getClient();
  if (!client) {
    throw new Error('R2 client unavailable despite env vars set');
  }
  const bucket = process.env.R2_BUCKET_NAME as string;
  const ttl = opts.ttlSeconds ?? 10 * 60; // 10 min default — plenty of time for a 10MB image
  const expiresAt = new Date(Date.now() + ttl * 1000).toISOString();

  const uploadUrl = await getSignedUrl(
    client,
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType,
    }),
    { expiresIn: ttl },
  );

  return { uploadUrl, key, expiresAt };
}

