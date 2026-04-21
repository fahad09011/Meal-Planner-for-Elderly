import { describe, it, expect, vi, afterEach } from "vitest";
import { getWeekStartDate, getWeekLastDate } from "@/utils/helpers.js";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("helpers", () => {

  describe("getWeekStartDate", () => {
    it("returns a string in yyyy-MM-dd format", () => {
      const result = getWeekStartDate();
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it("returns a Monday (weekStartsOn:1)", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-03-18T12:00:00"));
      const result = getWeekStartDate();
      expect(result).toBe("2026-03-16");
      vi.useRealTimers();
    });

    it("returns same day when today IS Monday", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-03-16T12:00:00"));
      const result = getWeekStartDate();
      expect(result).toBe("2026-03-16");
      vi.useRealTimers();
    });

    it("returns previous Monday when today is Sunday", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-03-22T12:00:00"));
      const result = getWeekStartDate();
      expect(result).toBe("2026-03-16");
      vi.useRealTimers();
    });
  });

  describe("getWeekLastDate", () => {
    it("returns a string in yyyy-MM-dd format", () => {
      const result = getWeekLastDate();
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it("returns Sunday when the week is Monday–Sunday", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-03-18T12:00:00"));
      expect(getWeekStartDate()).toBe("2026-03-16");
      expect(getWeekLastDate()).toBe("2026-03-22");
      vi.useRealTimers();
    });
  });
});
