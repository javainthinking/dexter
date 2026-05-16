import 'server-only';
import nodemailer, { type Transporter } from 'nodemailer';

/**
 * SMTP transport for the email sign-in code flow. Configuration via env
 * (defaults to Gmail). When SMTP_PASS is missing the transport short-
 * circuits and `sendSignInCodeEmail` returns `{ skipped: true }` so the
 * dev-mode UI can surface the code directly for testing.
 */

const SMTP_USER = process.env.SMTP_USER ?? 'noreply@dexter.app';
const APP_NAME = 'Dexter';

export const FROM = process.env.MAIL_FROM ?? `${APP_NAME} <${SMTP_USER}>`;

let cached: Transporter | null = null;

function getTransporter(): Transporter | null {
  if (cached) return cached;
  if (!process.env.SMTP_PASS) {
    if (process.env.NODE_ENV === 'production') {
      console.warn('SMTP_PASS is not set — email delivery is disabled');
    }
    return null;
  }
  cached = nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? 'smtp.gmail.com',
    port: Number.parseInt(process.env.SMTP_PORT ?? '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: SMTP_USER, pass: process.env.SMTP_PASS },
    connectionTimeout: 15_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });
  return cached;
}

export interface SignInCodeEmailInput {
  to: string;
  code: string;
  expiresInMinutes?: number;
}

export async function sendSignInCodeEmail(
  input: SignInCodeEmailInput,
): Promise<{ skipped: true } | { skipped: false; messageId: string }> {
  const transporter = getTransporter();
  if (!transporter) return { skipped: true };

  const minutes = input.expiresInMinutes ?? 10;

  // Plain, professional template — emerald accent, serif headline,
  // matches the in-app aesthetic (financial-analysis register).
  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#fafafa;font-family:-apple-system,BlinkMacSystemFont,'Inter','Segoe UI',Roboto,sans-serif;color:#18181b;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#fafafa;padding:40px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:480px;background:#ffffff;border:1px solid #e4e4e7;border-radius:12px;padding:36px 32px;">
            <tr>
              <td style="font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#71717a;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;">
                ${APP_NAME} · sign-in code
              </td>
            </tr>
            <tr>
              <td style="padding-top:20px;font-family:'Source Serif 4',Georgia,serif;font-size:24px;line-height:1.2;font-weight:600;color:#18181b;">
                Your verification code
              </td>
            </tr>
            <tr>
              <td style="padding-top:8px;font-size:15px;line-height:1.6;color:#52525b;">
                Enter this code in your Dexter sign-in window. It expires in ${minutes} minutes.
              </td>
            </tr>
            <tr>
              <td style="padding:24px 0;">
                <div style="display:inline-block;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:32px;letter-spacing:0.32em;font-weight:600;color:#18181b;padding:14px 22px;background:#fafafa;border:1px solid #e4e4e7;border-radius:8px;">
                  ${input.code}
                </div>
              </td>
            </tr>
            <tr>
              <td style="font-size:12px;line-height:1.6;color:#71717a;border-top:1px solid #e4e4e7;padding-top:18px;">
                If you didn't request this code you can safely ignore the email — no one will be signed in.
              </td>
            </tr>
          </table>
          <p style="margin-top:18px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#a1a1aa;">
            Dexter · For research only · Not investment advice
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = `Your Dexter sign-in code is ${input.code}\n\nIt expires in ${minutes} minutes. If you didn't request this code you can safely ignore this email.`;

  const info = await transporter.sendMail({
    from: FROM,
    to: input.to,
    subject: `Your Dexter sign-in code: ${input.code}`,
    text,
    html,
  });
  return { skipped: false, messageId: info.messageId };
}
