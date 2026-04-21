import { describe, it, expect, vi, beforeEach } from "vitest";

const mockSingle = vi.fn();
const mockSelect = vi.fn(() => ({ single: mockSingle }));
const mockUpsert = vi.fn(() => ({ select: mockSelect }));
const mockEq2 = vi.fn(() => ({ data: [], error: null }));
const mockEq1 = vi.fn(() => ({ eq: mockEq2 }));
const mockSelectAll = vi.fn(() => ({ eq: mockEq1 }));
const mockFrom = vi.fn(() => ({
  upsert: mockUpsert,
  select: mockSelectAll,
}));

vi.mock("@/services/database/supabaseClient", () => ({
  supabase: { from: (...args) => mockFrom(...args) },
}));

const { setMealCompletion, getMealCompletions } = await import(
  "@/services/database/mealCompletionService"
);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("mealCompletionService", () => {

  describe("setMealCompletion", () => {
    it("calls supabase.from('meal_completions')", async () => {
      mockSingle.mockResolvedValue({ data: { id: "c1" }, error: null });
      await setMealCompletion("plan-1", "Monday", "breakfast", true, "user-1");
      expect(mockFrom).toHaveBeenCalledWith("meal_completions");
    });

    it("passes correct payload to upsert", async () => {
      mockSingle.mockResolvedValue({ data: { id: "c1" }, error: null });
      await setMealCompletion("plan-1", "Monday", "breakfast", true, "user-1");

      const payload = mockUpsert.mock.calls[0][0][0];
      expect(payload.meal_plan_id).toBe("plan-1");
      expect(payload.day_of_week).toBe("Monday");
      expect(payload.meal_type).toBe("breakfast");
      expect(payload.completed).toBe(true);
      expect(payload.completed_at).toBeDefined();
      expect(payload.updated_by).toBe("user-1");
    });

    it("sets completed_at to null when completed is false", async () => {
      mockSingle.mockResolvedValue({ data: { id: "c1" }, error: null });
      await setMealCompletion("plan-1", "Monday", "breakfast", false, "user-1");

      const payload = mockUpsert.mock.calls[0][0][0];
      expect(payload.completed).toBe(false);
      expect(payload.completed_at).toBeNull();
    });

    it("uses correct onConflict key", async () => {
      mockSingle.mockResolvedValue({ data: { id: "c1" }, error: null });
      await setMealCompletion("plan-1", "Monday", "breakfast", true, "user-1");

      const options = mockUpsert.mock.calls[0][1];
      expect(options.onConflict).toBe("meal_plan_id,day_of_week,meal_type");
    });

    it("returns { success: true, data } on success", async () => {
      const mockData = { id: "c1", completed: true };
      mockSingle.mockResolvedValue({ data: mockData, error: null });

      const result = await setMealCompletion("plan-1", "Monday", "breakfast", true, "user-1");
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockData);
    });

    it("returns { success: false, error } on DB error", async () => {
      const mockError = { message: "constraint error" };
      mockSingle.mockResolvedValue({ data: null, error: mockError });

      const result = await setMealCompletion("plan-1", "Monday", "breakfast", true, "user-1");
      expect(result.success).toBe(false);
      expect(result.error).toEqual(mockError);
    });
  });

  describe("getMealCompletions", () => {
    it("calls supabase.from('meal_completions')", async () => {
      mockEq1.mockReturnValue({ data: [], error: null });
      await getMealCompletions("plan-1");
      expect(mockFrom).toHaveBeenCalledWith("meal_completions");
    });

    it("queries by meal_plan_id", async () => {
      mockEq1.mockReturnValue({ data: [], error: null });
      await getMealCompletions("plan-1");
      expect(mockSelectAll).toHaveBeenCalledWith("*");
      expect(mockEq1).toHaveBeenCalledWith("meal_plan_id", "plan-1");
    });

    it("returns { success: true, data } on success", async () => {
      const rows = [
        { day_of_week: "Monday", meal_type: "breakfast", completed: true },
      ];
      mockEq1.mockReturnValue({ data: rows, error: null });

      const result = await getMealCompletions("plan-1");
      expect(result.success).toBe(true);
      expect(result.data).toEqual(rows);
    });

    it("returns { success: false, error } on DB error", async () => {
      const err = { message: "table not found" };
      mockEq1.mockReturnValue({ data: null, error: err });

      const result = await getMealCompletions("plan-1");
      expect(result.success).toBe(false);
      expect(result.error).toEqual(err);
    });
  });
});
