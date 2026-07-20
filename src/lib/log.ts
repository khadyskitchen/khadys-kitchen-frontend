// src/lib/log.ts
//
// Dev-only error logging. Production builds stay silent - the UI already
// degrades gracefully (fallback data, error states), so the console noise
// only ever helped during development. Runs on both the server (ISR fetch
// helpers) and the client (error boundaries).
export function devError(...args: unknown[]): void {
  if (process.env.NODE_ENV !== "production") {
    console.error(...args);
  }
}
