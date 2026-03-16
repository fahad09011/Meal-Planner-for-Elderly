import { describe, it, expect, vi, beforeEach } from "vitest";
import { getProfile, createProfile, updateProfile } from "./profileService";

const mockSingle = vi.fn();
const mockSelect = vi.fn(() => ({ single: mockSingle }));
const mockEq = vi.fn(() => ({ single: mockSingle, select: mockSelect }));
const mockInsert = vi.fn(() => ({ select: mockSelect }));
const mockUpdate = vi.fn(() => ({ eq: mockEq }));
const mockFrom = vi.fn(() => ({
  select: vi.fn(() => ({ eq: mockEq })),
  insert: mockInsert,
  update: mockUpdate,
}));

vi.mock("./supabaseClient", () => ({
  supabase: { from: (...args) => mockFrom(...args) },
}));

const testUserId = "user-abc-123";
const testProfile = {
  ageGroup: "65-74",
  dietary: ["vegetarian"],
  allergies: ["gluten"],
  healthConditions: ["diabetes", "hypertension"],
  budget: "medium",
};
const dbRow = {
  id: 1,
  user_id: testUserId,
  age_group: "65-74",
  dietary: ["vegetarian"],
  allergies: ["gluten"],
  health_conditions: ["diabetes", "hypertension"],
  budget: "medium",
};

beforeEach(() => {
  vi.clearAllMocks();
});

// ===================== getProfile =====================
describe("getProfile", () => {
  it("returns success and data when profile exists", async () => {
    mockSingle.mockResolvedValue({ data: dbRow, error: null });
    const result = await getProfile(testUserId);

    expect(result.success).toBe(true);
    expect(result.data).toEqual(dbRow);
    expect(mockFrom).toHaveBeenCalledWith("profiles");
  });

  it("returns success:false when profile does not exist", async () => {
    const notFoundError = { code: "PGRST116", message: "Row not found" };
    mockSingle.mockResolvedValue({ data: null, error: notFoundError });
    const result = await getProfile("non-existent-user");

    expect(result.success).toBe(false);
    expect(result.error).toEqual(notFoundError);
  });

  it("returns success:false on generic DB error", async () => {
    const dbError = { code: "500", message: "Internal server error" };
    mockSingle.mockResolvedValue({ data: null, error: dbError });
    const result = await getProfile(testUserId);

    expect(result.success).toBe(false);
    expect(result.error.code).toBe("500");
  });
});

// ===================== createProfile =====================
describe("createProfile", () => {
  it("returns success and data on successful insert", async () => {
    mockSingle.mockResolvedValue({ data: dbRow, error: null });
    const result = await createProfile(testUserId, testProfile);

    expect(result.success).toBe(true);
    expect(result.data).toEqual(dbRow);
    expect(mockFrom).toHaveBeenCalledWith("profiles");
    expect(mockInsert).toHaveBeenCalledWith([
      {
        user_id: testUserId,
        age_group: testProfile.ageGroup,
        dietary: testProfile.dietary,
        allergies: testProfile.allergies,
        health_conditions: testProfile.healthConditions,
        budget: testProfile.budget,
      },
    ]);
  });

  it("returns success:false on duplicate key conflict", async () => {
    const conflictError = {
      code: "23505",
      message: 'duplicate key value violates unique constraint "unique_user_profile"',
    };
    mockSingle.mockResolvedValue({ data: null, error: conflictError });
    const result = await createProfile(testUserId, testProfile);

    expect(result.success).toBe(false);
    expect(result.error.code).toBe("23505");
  });

  it("maps all camelCase fields to snake_case in DB payload", async () => {
    mockSingle.mockResolvedValue({ data: dbRow, error: null });
    await createProfile(testUserId, testProfile);

    const payload = mockInsert.mock.calls[0][0][0];
    expect(payload).toHaveProperty("user_id", testUserId);
    expect(payload).toHaveProperty("age_group", "65-74");
    expect(payload).toHaveProperty("dietary", ["vegetarian"]);
    expect(payload).toHaveProperty("allergies", ["gluten"]);
    expect(payload).toHaveProperty("health_conditions", ["diabetes", "hypertension"]);
    expect(payload).toHaveProperty("budget", "medium");
    expect(payload).not.toHaveProperty("ageGroup");
    expect(payload).not.toHaveProperty("healthConditions");
  });

  it("handles empty arrays in profile data", async () => {
    const emptyProfile = {
      ageGroup: "75-84",
      dietary: [],
      allergies: [],
      healthConditions: [],
      budget: "low",
    };
    mockSingle.mockResolvedValue({ data: {}, error: null });
    const result = await createProfile(testUserId, emptyProfile);

    expect(result.success).toBe(true);
    const payload = mockInsert.mock.calls[0][0][0];
    expect(payload.dietary).toEqual([]);
    expect(payload.allergies).toEqual([]);
    expect(payload.health_conditions).toEqual([]);
  });
});

// ===================== updateProfile =====================
describe("updateProfile", () => {
  it("returns success and data on successful update", async () => {
    const updatedRow = { ...dbRow, age_group: "75-84", budget: "low" };
    mockSingle.mockResolvedValue({ data: updatedRow, error: null });
    const updatedProfile = { ...testProfile, ageGroup: "75-84", budget: "low" };
    const result = await updateProfile(testUserId, updatedProfile);

    expect(result.success).toBe(true);
    expect(result.data.age_group).toBe("75-84");
    expect(result.data.budget).toBe("low");
    expect(mockFrom).toHaveBeenCalledWith("profiles");
  });

  it("returns success:false when no matching row (RLS or missing)", async () => {
    const noRowError = {
      code: "PGRST116",
      message: "The result contains 0 rows",
    };
    mockSingle.mockResolvedValue({ data: null, error: noRowError });
    const result = await updateProfile("wrong-user-id", testProfile);

    expect(result.success).toBe(false);
    expect(result.error.code).toBe("PGRST116");
  });

  it("passes correct payload to .update()", async () => {
    mockSingle.mockResolvedValue({ data: dbRow, error: null });
    await updateProfile(testUserId, testProfile);

    const payload = mockUpdate.mock.calls[0][0];
    expect(payload).toHaveProperty("user_id", testUserId);
    expect(payload).toHaveProperty("age_group", "65-74");
    expect(payload).toHaveProperty("health_conditions", ["diabetes", "hypertension"]);
    expect(payload).not.toHaveProperty("ageGroup");
  });

  it("filters by correct user_id with .eq()", async () => {
    mockSingle.mockResolvedValue({ data: dbRow, error: null });
    await updateProfile(testUserId, testProfile);

    expect(mockEq).toHaveBeenCalledWith("user_id", testUserId);
  });

  it("handles updating with multiple health conditions", async () => {
    const complexProfile = {
      ageGroup: "85+",
      dietary: ["vegan", "gluten_free"],
      allergies: ["dairy", "peanut", "soy"],
      healthConditions: ["diabetes", "heartDisease", "osteoporosis"],
      budget: "flexible",
    };
    mockSingle.mockResolvedValue({ data: {}, error: null });
    const result = await updateProfile(testUserId, complexProfile);

    expect(result.success).toBe(true);
    const payload = mockUpdate.mock.calls[0][0];
    expect(payload.dietary).toEqual(["vegan", "gluten_free"]);
    expect(payload.allergies).toEqual(["dairy", "peanut", "soy"]);
    expect(payload.health_conditions).toEqual(["diabetes", "heartDisease", "osteoporosis"]);
  });
});
