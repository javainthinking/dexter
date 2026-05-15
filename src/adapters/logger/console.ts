/**
 * ConsoleLogger — writes structured records to stdout via console.* methods.
 * Used by CLI and the WhatsApp Worker. Web uses a JSON-formatted variant.
 */

import type { Logger, LogLevel } from '../../ports/logger.js';

const LEVELS: Record<LogLevel, number> = { debug: 10, info: 20, warn: 30, error: 40 };

export interface ConsoleLoggerOptions {
  minLevel?: LogLevel;
  baseFields?: Record<string, unknown>;
}

export class ConsoleLogger implements Logger {
  private readonly threshold: number;
  private readonly baseFields: Record<string, unknown>;

  constructor(options: ConsoleLoggerOptions = {}) {
    this.threshold = LEVELS[options.minLevel ?? 'info'];
    this.baseFields = options.baseFields ?? {};
  }

  log(level: LogLevel, message: string, fields: Record<string, unknown> = {}): void {
    if (LEVELS[level] < this.threshold) return;
    const merged = { ...this.baseFields, ...fields };
    const suffix = Object.keys(merged).length > 0 ? ` ${JSON.stringify(merged)}` : '';
    const line = `[${level}] ${message}${suffix}`;
    if (level === 'error') console.error(line);
    else if (level === 'warn') console.warn(line);
    else if (level === 'debug') console.debug(line);
    else console.log(line);
  }

  debug(message: string, fields?: Record<string, unknown>): void {
    this.log('debug', message, fields);
  }
  info(message: string, fields?: Record<string, unknown>): void {
    this.log('info', message, fields);
  }
  warn(message: string, fields?: Record<string, unknown>): void {
    this.log('warn', message, fields);
  }
  error(message: string, fields?: Record<string, unknown>): void {
    this.log('error', message, fields);
  }

  child(fields: Record<string, unknown>): Logger {
    return new ConsoleLogger({
      minLevel: (Object.keys(LEVELS) as LogLevel[]).find((k) => LEVELS[k] === this.threshold),
      baseFields: { ...this.baseFields, ...fields },
    });
  }
}
