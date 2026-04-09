import { describe, it, expect, vi, afterEach } from "vitest";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("helpers", () => {

  describe("getWeekStartDate", () => {
    it("returns a string in yyyy-MM-dd format", async () => {
      const { getWeekStartDate } = await import("./helpers");
      const result = getWeekStartDate();
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it("returns a Monday (weekStartsOn:1)", async () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-03-18T12:00:00")); // Wednesday
      const { getWeekStartDate } = await import("./helpers");
      const result = getWeekStartDate();
      expect(result).toBe("2026-03-16"); // Monday
      vi.useRealTimers();
    });

    it("returns same day when today IS Monday", async () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-03-16T12:00:00")); // Monday
      const { getWeekStartDate } = await import("./helpers");
      const result = getWeekStartDate();
      expect(result).toBe("2026-03-16");
      vi.useRealTimers();
    });

    it("returns previous Monday when today is Sunday", async () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-03-22T12:00:00")); // Sunday
      const { getWeekStartDate } = await import("./helpers");
      const result = getWeekStartDate();
      expect(result).toBe("2026-03-16");
      vi.useRealTimers();
    });
  });

  describe("getWeekLastDate", () => {
    it("returns a string in yyyy-MM-dd format", async () => {
      const { getWeekLastDate } = await import("./helpers");
      const result = getWeekLastDate();
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it("returns Sunday when the week is Monday–Sunday", async () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-03-18T12:00:00")); // Wednesday
      const { getWeekStartDate, getWeekLastDate } = await import("./helpers");
      expect(getWeekStartDate()).toBe("2026-03-16");
      expect(getWeekLastDate()).toBe("2026-03-22");
      vi.useRealTimers();
    });
  });
});
