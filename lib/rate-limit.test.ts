import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { rateLimiter } from "./rate-limit";

describe("rateLimiter", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("allows up to the limit, then refuses", () => {
    const allow = rateLimiter(3, 1000);
    expect([allow("a"), allow("a"), allow("a"), allow("a")]).toEqual([true, true, true, false]);
  });

  it("counts each key on its own", () => {
    const allow = rateLimiter(1, 1000);
    expect(allow("a")).toBe(true);
    expect(allow("a")).toBe(false);
    expect(allow("b")).toBe(true);
  });

  it("starts a fresh window once the old one has passed", () => {
    const allow = rateLimiter(1, 1000);
    expect(allow("a")).toBe(true);
    vi.advanceTimersByTime(999);
    expect(allow("a")).toBe(false);
    vi.advanceTimersByTime(1);
    expect(allow("a")).toBe(true);
  });

  it("does not extend the window while refusing", () => {
    const allow = rateLimiter(1, 1000);
    allow("a");
    vi.advanceTimersByTime(500);
    expect(allow("a")).toBe(false);
    vi.advanceTimersByTime(500);
    expect(allow("a")).toBe(true);
  });
});
