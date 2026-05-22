# R2 bucket CORS policy

The `/feedback` page uploads images directly from the browser to R2
via presigned PUT URLs minted by `/api/feedback/upload-url`. R2
defaults to no CORS, so the browser preflight (`OPTIONS`) is
rejected and the upload never starts.

This doc records the policy we apply and how to (re-)apply it.

## Policy

| Field | Value |
|---|---|
| Allowed origins | `https://pickskill.ai`, `https://www.pickskill.ai`, `https://*.vercel.app`, `http://localhost:3000`, `http://127.0.0.1:3000` |
| Allowed methods | `PUT`, `GET`, `HEAD` |
| Allowed headers | `*` |
| Exposed headers | `ETag` |
| Max age | 3600s (preflight cache) |

`AllowedHeaders: *` is intentional. The AWS SDK adds CRC32 checksum
headers (`x-amz-checksum-crc32`, `x-amz-sdk-checksum-algorithm`)
that aren't trivially knowable from the SDK version, and the request
is already gated by the presigned signature + origin allowlist —
header pinning would only break the upload flow without adding
security.

Vercel preview deploys use the `*.vercel.app` wildcard so the
feedback flow is testable in PR previews.

## Applying

The policy lives in `scripts/apply-r2-cors.ts`. There are three
paths depending on which credentials you have to hand. The current
production `R2_*` keys are **object-scoped**, which means they get
`AccessDenied (403)` on `PutBucketCors`. Use one of the other two
paths.

### Path A — Cloudflare dashboard (fastest unblock)

1. Open the Cloudflare dashboard → R2 → the bucket → Settings → CORS Policy.
2. Run `bun run scripts/apply-r2-cors.ts --print` and paste the
   printed JSON into the dashboard's editor.
3. Save. CORS takes effect within a few seconds.

### Path B — Cloudflare REST API (automatable, no admin S3 key)

Create a **Cloudflare API token** (not an R2 S3 key) with the
"Workers R2 Storage:Edit" permission scoped to the account. Then:

```bash
export CLOUDFLARE_API_TOKEN=<your-token>
# R2_ACCOUNT_ID + R2_BUCKET_NAME already in .env
bun run scripts/apply-r2-cors.ts
```

The script detects the Cloudflare token and uses the REST endpoint
`PUT /accounts/{account_id}/r2/buckets/{bucket}/cors`. This is the
preferred automation path.

### Path C — S3-compatible admin token

Mint a separate R2 API token with **Admin Read & Write** permission
on the bucket, export its keys as `R2_ACCESS_KEY_ID` /
`R2_SECRET_ACCESS_KEY` (overriding the object-only production
keys), and run:

```bash
bun run scripts/apply-r2-cors.ts
```

### Verifying

After applying, the browser preflight `OPTIONS` to
`https://<account>.r2.cloudflarestorage.com/<bucket>/...` should
return `204 No Content` with `Access-Control-Allow-Origin: <your
origin>` and the upload `PUT` should proceed.

To check the current policy from the shell:

```bash
bun run scripts/apply-r2-cors.ts --check
# (requires read perm on the bucket; object-scoped keys see 403 too)
```

## Diagnosing a future regression

If uploads start failing again with `Response to preflight request
doesn't pass access control check`:

1. Run `bun run scripts/apply-r2-cors.ts --check` and compare
   against the table above.
2. If a deploy added a new origin (custom domain, locale subdomain),
   update the `AllowedOrigins` list in `scripts/apply-r2-cors.ts`
   and re-apply.
3. If the AWS SDK upgrade introduced a new request header that R2
   rejects, the easiest fix is keeping `AllowedHeaders: *`. Don't
   pin the header list per SDK version — it churns.
