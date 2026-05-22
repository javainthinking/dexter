/**
 * Apply a CORS policy to the R2 bucket used for client-direct uploads.
 *
 * Why this exists: the `/feedback` page mints presigned PUT URLs and
 * the browser PUTs files straight to R2 from the user's origin
 * (`https://pickskill.ai`). R2 buckets default to no CORS, so the
 * browser preflight (OPTIONS) gets a 403 with no `Access-Control-*`
 * headers and the upload is blocked. This script ships a tight CORS
 * policy that:
 *
 *   - Allows PUT (uploads) and GET/HEAD (download checks) only from
 *     the production origin, the www variant, all Vercel preview
 *     deploys, and localhost/127.0.0.1 for `next dev`.
 *   - Permits the headers the AWS SDK actually sends in browser
 *     uploads (`Content-Type` + the CRC32 checksum headers added in
 *     `@aws-sdk/client-s3` ≥ 3.430).
 *   - Exposes `ETag` so the client can confirm the upload.
 *
 * Usage:
 *   bun run scripts/apply-r2-cors.ts          # apply + verify
 *   bun run scripts/apply-r2-cors.ts --check  # show current policy, no write
 *   bun run scripts/apply-r2-cors.ts --print  # print the JSON for the dashboard
 *
 * Two credential paths are supported:
 *   1. S3-compatible R2 token (R2_ACCESS_KEY_ID + R2_SECRET_ACCESS_KEY)
 *      — must have **Admin Read & Write** permission on the bucket.
 *      Object-only tokens get 403 AccessDenied on PutBucketCors.
 *   2. Cloudflare API token (CLOUDFLARE_API_TOKEN + R2_ACCOUNT_ID)
 *      with the "Workers R2 Storage:Edit" permission — same effect,
 *      goes through Cloudflare's REST API instead of S3. Useful when
 *      you don't want to mint a bucket-admin S3 key.
 *
 * If neither path has CORS perms, run with `--print` to get the JSON
 * to paste into the Cloudflare dashboard (R2 → bucket → Settings →
 * CORS Policy).
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  S3Client,
  PutBucketCorsCommand,
  GetBucketCorsCommand,
  type CORSRule,
} from '@aws-sdk/client-s3';

// Lightweight .env.local loader. We avoid pulling dotenv as a dep just
// for this script — the .env file format is simple key=value with
// optional quoting, and we only need to populate `process.env`.
function loadEnvFile(path: string): void {
  let raw: string;
  try {
    raw = readFileSync(path, 'utf-8');
  } catch {
    return; // No env file; rely on the parent process env.
  }
  for (const rawLine of raw.split('\n')) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq < 0) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnvFile(join(process.cwd(), '.env'));
loadEnvFile(join(process.cwd(), 'apps/web/.env.local'));
loadEnvFile(join(process.cwd(), '.env.local'));

function required(name: string): string {
  const v = process.env[name];
  if (!v) {
    console.error(`Missing required env var: ${name}`);
    process.exit(1);
  }
  return v;
}

const bucket = required('R2_BUCKET_NAME');
const accountId = process.env.R2_ACCOUNT_ID;
const cloudflareToken = process.env.CLOUDFLARE_API_TOKEN;

// Build the S3 client lazily so `--print` mode works without
// credentials being set.
function buildS3Client(): S3Client {
  return new S3Client({
    region: 'auto',
    endpoint: required('R2_ENDPOINT_URL'),
    credentials: {
      accessKeyId: required('R2_ACCESS_KEY_ID'),
      secretAccessKey: required('R2_SECRET_ACCESS_KEY'),
    },
    forcePathStyle: true,
  });
}

// One single rule covers every PUT/GET origin we trust. Cloudflare R2
// supports wildcard subdomains via the `*.example.com` form, which we
// use to cover preview deployments on Vercel.
const corsRules: CORSRule[] = [
  {
    ID: 'pickskill-web-uploads',
    AllowedOrigins: [
      'https://pickskill.ai',
      'https://www.pickskill.ai',
      'https://*.vercel.app',
      'http://localhost:3000',
      'http://127.0.0.1:3000',
    ],
    AllowedMethods: ['PUT', 'GET', 'HEAD'],
    AllowedHeaders: [
      // Browser preflights send `Access-Control-Request-Headers: *`
      // when the AWS SDK adds checksum headers dynamically. The
      // simplest and safest config is to allow all request headers —
      // we already gate writes by presigned signature, so the origin
      // allowlist + signed URL is what actually enforces auth.
      '*',
    ],
    ExposeHeaders: ['ETag'],
    MaxAgeSeconds: 3600,
  },
];

async function applyCorsViaS3(): Promise<void> {
  const client = buildS3Client();
  console.log(`Applying CORS via S3 API to "${bucket}"`);
  await client.send(
    new PutBucketCorsCommand({
      Bucket: bucket,
      CORSConfiguration: { CORSRules: corsRules },
    }),
  );
  console.log('✓ CORS policy written via S3 API.');
}

async function showCurrentViaS3(): Promise<void> {
  const client = buildS3Client();
  try {
    const res = await client.send(new GetBucketCorsCommand({ Bucket: bucket }));
    console.log('Current CORS rules (via S3):');
    console.log(JSON.stringify(res.CORSRules ?? [], null, 2));
  } catch (err) {
    const code = (err as { $metadata?: { httpStatusCode?: number } }).$metadata
      ?.httpStatusCode;
    if (code === 404) {
      console.log('No CORS policy currently set on the bucket.');
      return;
    }
    throw err;
  }
}

/**
 * Cloudflare REST API CORS shape — close to but NOT identical to the
 * S3 shape. Keys are camelCase here, headers/methods stay arrays.
 * See https://developers.cloudflare.com/r2/buckets/cors/
 */
function toCloudflareCorsShape() {
  return {
    rules: corsRules.map((r) => ({
      allowed: {
        origins: r.AllowedOrigins ?? [],
        methods: r.AllowedMethods ?? [],
        headers: r.AllowedHeaders ?? [],
      },
      exposeHeaders: r.ExposeHeaders ?? [],
      maxAgeSeconds: r.MaxAgeSeconds ?? undefined,
    })),
  };
}

async function applyCorsViaCloudflare(): Promise<void> {
  if (!accountId || !cloudflareToken) {
    throw new Error(
      'Need R2_ACCOUNT_ID and CLOUDFLARE_API_TOKEN for the Cloudflare REST path',
    );
  }
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/r2/buckets/${bucket}/cors`;
  console.log(`Applying CORS via Cloudflare REST to "${bucket}"`);
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${cloudflareToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(toCloudflareCorsShape()),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Cloudflare REST returned ${res.status}: ${body}`);
  }
  console.log('✓ CORS policy written via Cloudflare REST.');
}

function printDashboardJson(): void {
  console.log('Paste this JSON into Cloudflare dashboard');
  console.log('(R2 → bucket → Settings → CORS Policy → JSON):');
  console.log('');
  console.log(JSON.stringify(toCloudflareCorsShape().rules, null, 2));
}

const args = process.argv.slice(2);
const checkOnly = args.includes('--check');
const printOnly = args.includes('--print');

if (printOnly) {
  printDashboardJson();
} else if (checkOnly) {
  await showCurrentViaS3();
} else {
  // Prefer the Cloudflare REST path when the token is available —
  // it's the one that works without minting an admin S3 key.
  if (accountId && cloudflareToken) {
    await applyCorsViaCloudflare();
  } else {
    await applyCorsViaS3();
  }
  console.log('---');
  await showCurrentViaS3().catch((err) => {
    console.warn('(verify step skipped: read perm missing)', err.message);
  });
}
