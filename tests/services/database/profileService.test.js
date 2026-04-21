import { describe, it, expect, vi, beforeEach } from "vitest";
import { getProfile, createProfile, updateProfile } from "@/services/database/profileService";

const mockSingle = vi.fn();
const mockMaybeSingle = vi.fn();
const mockSelect = vi.fn(() => ({ single: mockSingle }));
const mockEq = vi.fn(() => ({
  single: mockSingle,
  maybeSingle: mockMaybeSingle,
  select: mockSelect,
}));
const mockInsert = vi.fn(() => ({ select: mockSelect }));
const mockUpdate = vi.fn(() => ({ eq: mockEq }));
const mockFrom = vi.fn(() => ({
  select: vi.fn(() => ({ eq: mockEq })),
  insert: mockInsert,
  update: mockUpdate,
}));

vi.mock("@/services/database/supabaseClient", () => ({
  supabase: { from: (...args) => mockFrom(...args) },
}));

const testUserId = "user-abc-123";
const testProfile = {
  age: "68",
  weightKg: "72",
  heightCm: "165",
  gender: "female",
  activityLevel: "lightly_active",
  dietary: ["vegetarian"],
  allergies: ["gluten"],
  healthConditions: ["diabetes", "hypertension"],
  budget: "medium",
  appRole: "elderly",
};
const dbRow = {
  id: 1,
  user_id: testUserId,
  age: 68,
  weight: 72,
  height: 165,
  gender: "female",
  activity_level: "lightly_active",
  dietary: ["vegetarian"],
  allergies: ["gluten"],
  health_conditions: ["diabetes", "hypertension"],
  budget: "medium",
  app_role: "elderly",
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getProfile", () => {
  it("returns success and data when profile exists", async () => {
    mockMaybeSingle.mockResolvedValue({ data: dbRow, error: null });
    const result = await getProfile(testUserId);

    expect(result.success).toBe(true);
    expect(result.data).toEqual(dbRow);
    expect(mockFrom).toHaveBeenCalledWith("profiles");
  });

  it("returns success:true and data:null when profile does not exist", async () => {
    mockMaybeSingle.mockResolvedValue({ data: null, error: null });
    const result = await getProfile("non-existent-user");

    expect(result.success).toBe(true);
    expect(result.data).toBeNull();
  });

  it("returns success:false on generic DB error", async () => {
    const dbError = { code: "500", message: "Internal server error" };
    mockMaybeSingle.mockResolvedValue({ data: null, error: dbError });
    const result = await getProfile(testUserId);

    expect(result.success).toBe(false);
    expect(result.error.code).toBe("500");
  });
});

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
        age: 68,
        weight: 72,
        height: 165,
        gender: "female",
        activity_level: "lightly_active",
        dietary: testProfile.dietary,
        allergies: testProfile.allergies,
        health_conditions: testProfile.healthConditions,
        budget: testProfile.budget,
        app_role: "elderly",
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
    expect(payload).toHaveProperty("age", 68);
    expect(payload).toHaveProperty("weight", 72);
    expect(payload).toHaveProperty("height", 165);
    expect(payload).toHaveProperty("gender", "female");
    expect(payload).toHaveProperty("activity_level", "lightly_active");
    expect(payload).toHaveProperty("dietary", ["vegetarian"]);
    expect(payload).toHaveProperty("app_role", "elderly");
    expect(payload).not.toHaveProperty("ageGroup");
    expect(payload).not.toHaveProperty("healthConditions");
  });

  it("handles empty arrays in profile data", async () => {
    const emptyProfile = {
      age: "70",
      weightKg: "80",
      heightCm: "170",
      gender: "male",
      activityLevel: "sedentary",
      dietary: [],
      allergies: [],
      healthConditions: [],
      budget: "low",
      appRole: "caregiver",
    };
    mockSingle.mockResolvedValue({ data: {}, error: null });
    const result = await createProfile(testUserId, emptyProfile);

    expect(result.success).toBe(true);
    const payload = mockInsert.mock.calls[0][0][0];
    expect(payload.dietary).toEqual([]);
    expect(payload.allergies).toEqual([]);
    expect(payload.health_conditions).toEqual([]);
    expect(payload.app_role).toBe("caregiver");
  });
});

describe("updateProfile", () => {
  it("returns success and data on successful update", async () => {
    const updatedRow = { ...dbRow, age: 76, budget: "low" };
    mockSingle.mockResolvedValue({ data: updatedRow, error: null });
    const updatedProfile = { ...testProfile, age: "76", budget: "low" };
    const result = await updateProfile(testUserId, updatedProfile);

    expect(result.success).toBe(true);
    expect(result.data.age).toBe(76);
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
    expect(payload).toHaveProperty("age", 68);
    expect(payload).toHaveProperty("activity_level", "lightly_active");
    expect(payload).toHaveProperty("health_conditions", ["diabetes", "hypertension"]);
    expect(payload).toHaveProperty("app_role", "elderly");
    expect(payload).not.toHaveProperty("ageGroup");
  });

  it("filters by correct user_id with .eq()", async () => {
    mockSingle.mockResolvedValue({ data: dbRow, error: null });
    await updateProfile(testUserId, testProfile);

    expect(mockEq).toHaveBeenCalledWith("user_id", testUserId);
  });

  it("handles updating with multiple health conditions", async () => {
    const complexProfile = {
      age: "80",
      weightKg: "65",
      heightCm: "160",
      gender: "female",
      activityLevel: "extra_active",
      dietary: ["vegan", "gluten_free"],
      allergies: ["dairy", "peanut", "soy"],
      healthConditions: ["diabetes", "heartDisease", "osteoporosis"],
      budget: "flexible",
      appRole: "both",
    };
    mockSingle.mockResolvedValue({ data: {}, error: null });
    const result = await updateProfile(testUserId, complexProfile);

    expect(result.success).toBe(true);
    const payload = mockUpdate.mock.calls[0][0];
    expect(payload.dietary).toEqual(["vegan", "gluten_free"]);
    expect(payload.allergies).toEqual(["dairy", "peanut", "soy"]);
    expect(payload.health_conditions).toEqual(["diabetes", "heartDisease", "osteoporosis"]);
    expect(payload.app_role).toBe("both");
  });
});
