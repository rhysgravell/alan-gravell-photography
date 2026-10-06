// A fixed-window counter kept in memory. It lives as long as the server
// process, so on a host that runs several instances (or starts new ones on
// demand, like Vercel) each instance counts on its own: a speed bump against
// a script hammering the form, not a hard guarantee.

type Window = { count: number; resetAt: number };

export function rateLimiter(limit: number, windowMs: number) {
  const windows = new Map<string, Window>();

  /** Counts one use of `key`; false once it is over the limit. */
  return function allow(key: string): boolean {
    const now = Date.now();
    for (const [k, w] of windows) if (w.resetAt <= now) windows.delete(k);

    const w = windows.get(key);
    if (!w) {
      windows.set(key, { count: 1, resetAt: now + windowMs });
      return true;
    }
    w.count += 1;
    return w.count <= limit;
  };
}
