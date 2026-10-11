import { NextResponse } from 'next/server';

/**
 * GET /api/desktop/auth-config — which sign-in methods the desktop app's
 * sign-in screen should offer (mirrors the web sign-in page). Public.
 */
export const dynamic = 'force-dynamic';

export function GET(): Response {
  return NextResponse.json({
    google: !!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET,
  });
}
