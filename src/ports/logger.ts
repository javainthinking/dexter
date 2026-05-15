/**
 * Logger — structured logging port.
 *
 * Adapters:
 *   - adapters/logger/console         CLI / Worker — writes to stdout
 *   - adapters/logger/file            Append to .dexter/gateway-debug.log etc.
 *   - adapters/logger/vercel          Web SaaS — emits structured JSON to stdout
 *                                      (Vercel ingests it into Log Drains)
 *
 * Keep the interface small. Use structured fields rather than printf.
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface Logger {
  log(level: LogLevel, message: string, fields?: Record<string, unknown>): void;
  debug(message: string, fields?: Record<string, unknown>): void;
  info(message: string, fields?: Record<string, unknown>): void;
  warn(message: string, fields?: Record<string, unknown>): void;
  error(message: string, fields?: Record<string, unknown>): void;
  /** Return a child logger that adds the given fields to every record. */
  child(fields: Record<string, unknown>): Logger;
}
