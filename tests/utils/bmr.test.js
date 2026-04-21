import { describe, it, expect } from "vitest";
import {
  calculateRestingDailyCalories,
  calculateDailyCaloriesAfterActivity,
  getRestingAndDailyCaloriesFromProfile,
  getMaxCaloriesPerMeal,
  getMinCaloriesPerMeal,
} from "@/utils/bmr";

describe("calculateRestingDailyCalories", () => {
  it("returns null for empty or invalid inputs", () => {
    expect(
      calculateRestingDailyCalories({ age: "", weightKg: "70", heightCm: "170", gender: "male" }),
    ).toBeNull();
    expect(
      calculateRestingDailyCalories({ age: "30", weightKg: "0", heightCm: "170", gender: "male" }),
    ).toBeNull();
    expect(
      calculateRestingDailyCalories({ age: "30", weightKg: "70", heightCm: "170", gender: "" }),
    ).toBeNull();
  });

  it("matches known male example (30 years, 70 kg, 175 cm)", () => {
    const resting = calculateRestingDailyCalories({
      age: 30,
      weightKg: 70,
      heightCm: 175,
      gender: "male",
    });
    expect(resting).toBe(1649);
  });

  it("female result is lower than male for same age, weight, and height", () => {
    const maleResting = calculateRestingDailyCalories({
      age: 65,
      weightKg: 70,
      heightCm: 165,
      gender: "male",
    });
    const femaleResting = calculateRestingDailyCalories({
      age: 65,
      weightKg: 70,
      heightCm: 165,
      gender: "female",
    });
    expect(maleResting).not.toBeNull();
    expect(femaleResting).not.toBeNull();
    expect(maleResting - femaleResting).toBe(166);
  });
});

describe("calculateDailyCaloriesAfterActivity", () => {
  it("multiplies resting calories by activity factor", () => {
    expect(calculateDailyCaloriesAfterActivity(1500, "sedentary")).toBe(1800);
    expect(calculateDailyCaloriesAfterActivity(1500, "lightly_active")).toBe(2063);
  });

  it("returns null for unknown activity id", () => {
    expect(calculateDailyCaloriesAfterActivity(1500, "unknown")).toBeNull();
  });
});

describe("getRestingAndDailyCaloriesFromProfile", () => {
  it("returns resting and daily calories when profile is complete", () => {
    const { restingCalories, dailyCalories } = getRestingAndDailyCaloriesFromProfile({
      age: "68",
      weightKg: "72",
      heightCm: "165",
      gender: "female",
      activityLevel: "lightly_active",
    });
    expect(restingCalories).toBeGreaterThan(0);
    expect(dailyCalories).toBeGreaterThan(restingCalories);
  });

  it("returns dailyCalories null without activity level", () => {
    const { restingCalories, dailyCalories } = getRestingAndDailyCaloriesFromProfile({
      age: "68",
      weightKg: "72",
      heightCm: "165",
      gender: "female",
      activityLevel: "",
    });
    expect(restingCalories).not.toBeNull();
    expect(dailyCalories).toBeNull();
  });
});

describe("getMaxCaloriesPerMeal", () => {
  it("returns null when profile has no daily budget and no weight management", () => {
    expect(
      getMaxCaloriesPerMeal({
        dietary: [],
        allergies: [],
        healthConditions: [],
        budget: "",
      }),
    ).toBeNull();
  });

  it("returns weight-management cap when only that condition is set", () => {
    expect(
      getMaxCaloriesPerMeal({
        dietary: [],
        allergies: [],
        healthConditions: ["weightManagement"],
        budget: "",
      }),
    ).toBe(550);
  });

  it("uses the lower of daily-budget-per-meal and weight-management cap when both apply", () => {
    const profile = {
      age: "70",
      weightKg: "60",
      heightCm: "160",
      gender: "female",
      activityLevel: "sedentary",
      dietary: [],
      allergies: [],
      healthConditions: ["weightManagement"],
      budget: "",
    };
    const { dailyCalories } = getRestingAndDailyCaloriesFromProfile(profile);
    expect(dailyCalories).not.toBeNull();
    expect(getMaxCaloriesPerMeal(profile)).toBe(
      Math.min(Math.round(dailyCalories / 3), 550),
    );
  });
});

describe("getMinCaloriesPerMeal", () => {
  it("returns null when there is no per-meal max", () => {
    expect(
      getMinCaloriesPerMeal({
        dietary: [],
        allergies: [],
        healthConditions: [],
        budget: "",
      }),
    ).toBeNull();
  });

  it("is ~45% of max, capped below max (weight management only)", () => {
    const profile = {
      dietary: [],
      allergies: [],
      healthConditions: ["weightManagement"],
      budget: "",
    };
    const max = getMaxCaloriesPerMeal(profile);
    const min = getMinCaloriesPerMeal(profile);
    expect(max).toBe(550);
    expect(min).toBe(Math.min(Math.round(max * 0.45), max - 1));
    expect(min).toBeLessThan(max);
  });
});
