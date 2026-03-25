import { describe, it, expect, vi, beforeEach } from "vitest";

const mockSingle = vi.fn();
const mockSelect = vi.fn(() => ({ single: mockSingle }));
const mockUpsert = vi.fn(() => ({ select: mockSelect }));
const mockGetSingle = vi.fn();
const mockGetEq2 = vi.fn(() => ({ maybeSingle: mockGetSingle }));
const mockGetEq1 = vi.fn(() => ({ eq: mockGetEq2 }));
const mockGetSelect = vi.fn(() => ({ eq: mockGetEq1 }));
const mockFrom = vi.fn(() => ({ upsert: mockUpsert, select: mockGetSelect }));

vi.mock("./supabaseClient", () => ({
  supabase: { from: (...args) => mockFrom(...args) },
}));

const { saveMealPlan, getMealPlanByWeek } = await import("./mealPlanService");

const userId = "user-123";
const weekStartDate = "2026-03-16";
const samplePlan = {
  Monday: {
    breakfast: { id: 1, title: "Oatmeal", nutrition: { calories: { amount: 200 } } },
    lunch: { id: 2, title: "Salad", nutrition: { calories: { amount: 350 } } },
    dinner: { id: 3, title: "Soup", nutrition: { calories: { amount: 400 } } },
  },
  Tuesday: { breakfast: null, lunch: null, dinner: null },
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("mealPlanService: saveMealPlan", () => {

  it("calls supabase.from('meal_plans')", async () => {
    mockSingle.mockResolvedValue({ data: { id: "plan-1" }, error: null });
    await saveMealPlan(userId, weekStartDate, samplePlan);
    expect(mockFrom).toHaveBeenCalledWith("meal_plans");
  });

  it("passes correct payload to upsert", async () => {
    mockSingle.mockResolvedValue({ data: { id: "plan-1" }, error: null });
    await saveMealPlan(userId, weekStartDate, samplePlan);

    const payload = mockUpsert.mock.calls[0][0][0];
    expect(payload.user_id).toBe(userId);
    expect(payload.week_start_date).toBe(weekStartDate);
    expect(payload.weekly_plan).toBe(samplePlan);
    expect(payload.generation_mode).toBe("manual");
    expect(payload.updated_at).toBeDefined();
  });

  it("uses correct onConflict for upsert", async () => {
    mockSingle.mockResolvedValue({ data: { id: "plan-1" }, error: null });
    await saveMealPlan(userId, weekStartDate, samplePlan);

    const options = mockUpsert.mock.calls[0][1];
    expect(options.onConflict).toBe("user_id,week_start_date");
  });

  it("passes custom generationMode when provided", async () => {
    mockSingle.mockResolvedValue({ data: { id: "plan-1" }, error: null });
    await saveMealPlan(userId, weekStartDate, samplePlan, "auto");

    const payload = mockUpsert.mock.calls[0][0][0];
    expect(payload.generation_mode).toBe("auto");
  });

  it("defaults generationMode to 'manual'", async () => {
    mockSingle.mockResolvedValue({ data: { id: "plan-1" }, error: null });
    await saveMealPlan(userId, weekStartDate, samplePlan);

    const payload = mockUpsert.mock.calls[0][0][0];
    expect(payload.generation_mode).toBe("manual");
  });

  it("returns { success: true, data } on success", async () => {
    const mockData = { id: "plan-1", user_id: userId };
    mockSingle.mockResolvedValue({ data: mockData, error: null });

    const result = await saveMealPlan(userId, weekStartDate, samplePlan);
    expect(result.success).toBe(true);
    expect(result.data).toEqual(mockData);
  });

  it("returns { success: false, error } on DB error", async () => {
    const mockError = { message: "DB constraint failed", code: "23505" };
    mockSingle.mockResolvedValue({ data: null, error: mockError });

    const result = await saveMealPlan(userId, weekStartDate, samplePlan);
    expect(result.success).toBe(false);
    expect(result.error).toEqual(mockError);
  });

  it("chains .select().single() after upsert", async () => {
    mockSingle.mockResolvedValue({ data: { id: "plan-1" }, error: null });
    await saveMealPlan(userId, weekStartDate, samplePlan);

    expect(mockSelect).toHaveBeenCalled();
    expect(mockSingle).toHaveBeenCalled();
  });

  it("stores updated_at as a valid ISO string", async () => {
    mockSingle.mockResolvedValue({ data: { id: "plan-1" }, error: null });

    const before = new Date().toISOString();
    await saveMealPlan(userId, weekStartDate, samplePlan);
    const after = new Date().toISOString();

    const payload = mockUpsert.mock.calls[0][0][0];
    expect(payload.updated_at >= before).toBe(true);
    expect(payload.updated_at <= after).toBe(true);
  });

  it("preserves full weeklyPlan structure (JSONB snapshot)", async () => {
    mockSingle.mockResolvedValue({ data: { id: "plan-1" }, error: null });
    await saveMealPlan(userId, weekStartDate, samplePlan);

    const payload = mockUpsert.mock.calls[0][0][0];
    expect(payload.weekly_plan.Monday.breakfast.title).toBe("Oatmeal");
    expect(payload.weekly_plan.Monday.lunch.nutrition.calories.amount).toBe(350);
    expect(payload.weekly_plan.Tuesday.breakfast).toBeNull();
  });
});

describe("mealPlanService: getMealPlanByWeek", () => {

  it("calls supabase.from('meal_plans')", async () => {
    mockGetSingle.mockResolvedValue({ data: { id: "plan-1" }, error: null });
    await getMealPlanByWeek(userId, weekStartDate);
    expect(mockFrom).toHaveBeenCalledWith("meal_plans");
  });

  it("queries with user_id and week_start_date", async () => {
    mockGetSingle.mockResolvedValue({ data: { id: "plan-1" }, error: null });
    await getMealPlanByWeek(userId, weekStartDate);

    expect(mockGetSelect).toHaveBeenCalledWith("*");
    expect(mockGetEq1).toHaveBeenCalledWith("user_id", userId);
    expect(mockGetEq2).toHaveBeenCalledWith("week_start_date", weekStartDate);
  });

  it("returns { success: true, data } on success", async () => {
    const mockData = { id: "plan-1", weekly_plan: samplePlan };
    mockGetSingle.mockResolvedValue({ data: mockData, error: null });

    const result = await getMealPlanByWeek(userId, weekStartDate);
    expect(result.success).toBe(true);
    expect(result.data.weekly_plan).toEqual(samplePlan);
  });

  it("returns { success: true, data: null } when no row found (maybeSingle)", async () => {
    mockGetSingle.mockResolvedValue({ data: null, error: null });

    const result = await getMealPlanByWeek(userId, weekStartDate);
    expect(result.success).toBe(true);
    expect(result.data).toBeNull();
  });

  it("returns { success: false, error } on DB error", async () => {
    mockGetSingle.mockResolvedValue({ data: null, error: { message: "DB down" } });

    const result = await getMealPlanByWeek(userId, weekStartDate);
    expect(result.success).toBe(false);
  });
});
