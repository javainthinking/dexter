/**
 * Clock — injectable time source. Lets tests freeze time and lets the Web
 * runtime use a request-time-injected `Date` for tracing.
 */

export interface Clock {
  now(): number;
  date(): Date;
}

export const systemClock: Clock = {
  now: () => Date.now(),
  date: () => new Date(),
};
