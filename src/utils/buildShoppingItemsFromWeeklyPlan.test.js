import { describe, it, expect } from "vitest";
import { buildShoppingItemsFromWeeklyPlan } from "./buildShoppingItemsFromWeeklyPlan";

const emptyWeek = {
  Monday: { breakfast: null, lunch: null, dinner: null },
  Tuesday: { breakfast: null, lunch: null, dinner: null },
  Wednesday: { breakfast: null, lunch: null, dinner: null },
  Thursday: { breakfast: null, lunch: null, dinner: null },
  Friday: { breakfast: null, lunch: null, dinner: null },
  Saturday: { breakfast: null, lunch: null, dinner: null },
  Sunday: { breakfast: null, lunch: null, dinner: null },
};

const makeMeal = (ingredients) => ({
  id: 1,
  title: "Test Meal",
  ingredients,
});

describe("buildShoppingItemsFromWeeklyPlan", () => {

  it("returns empty array for an empty weekly plan", () => {
    const result = buildShoppingItemsFromWeeklyPlan(emptyWeek);
    expect(result).toEqual([]);
  });

  it("returns empty array for null/undefined plan", () => {
    expect(buildShoppingItemsFromWeeklyPlan(null)).toEqual([]);
    expect(buildShoppingItemsFromWeeklyPlan(undefined)).toEqual([]);
  });

  it("extracts a single ingredient from one meal", () => {
    const plan = {
      ...emptyWeek,
      Monday: {
        breakfast: makeMeal([
          { name: "Oats", category: "Grains", aisle: "Cereal", quantity: { amount: 100, unit: "g" } },
        ]),
        lunch: null,
        dinner: null,
      },
    };
    const result = buildShoppingItemsFromWeeklyPlan(plan);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Oats");
    expect(result[0].amount).toBe(100);
    expect(result[0].unit).toBe("g");
    expect(result[0].category).toBe("Grains");
  });

  it("merges duplicate ingredients (same name + unit) by summing amounts", () => {
    const plan = {
      ...emptyWeek,
      Monday: {
        breakfast: makeMeal([
          { name: "Milk", category: "Dairy", aisle: "Dairy", quantity: { amount: 200, unit: "ml" } },
        ]),
        lunch: makeMeal([
          { name: "Milk", category: "Dairy", aisle: "Dairy", quantity: { amount: 300, unit: "ml" } },
        ]),
        dinner: null,
      },
    };
    const result = buildShoppingItemsFromWeeklyPlan(plan);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Milk");
    expect(result[0].amount).toBe(500);
  });

  it("does NOT merge same ingredient with different units", () => {
    const plan = {
      ...emptyWeek,
      Monday: {
        breakfast: makeMeal([
          { name: "Sugar", category: "Baking", aisle: "Baking", quantity: { amount: 2, unit: "tbsp" } },
        ]),
        lunch: makeMeal([
          { name: "Sugar", category: "Baking", aisle: "Baking", quantity: { amount: 50, unit: "g" } },
        ]),
        dinner: null,
      },
    };
    const result = buildShoppingItemsFromWeeklyPlan(plan);
    expect(result).toHaveLength(2);
  });

  it("merges across different days", () => {
    const plan = {
      ...emptyWeek,
      Monday: {
        breakfast: makeMeal([
          { name: "Egg", category: "Dairy", aisle: "Dairy", quantity: { amount: 2, unit: "" } },
        ]),
        lunch: null,
        dinner: null,
      },
      Wednesday: {
        breakfast: null,
        lunch: makeMeal([
          { name: "Egg", category: "Dairy", aisle: "Dairy", quantity: { amount: 3, unit: "" } },
        ]),
        dinner: null,
      },
    };
    const result = buildShoppingItemsFromWeeklyPlan(plan);
    expect(result).toHaveLength(1);
    expect(result[0].amount).toBe(5);
  });

  it("skips ingredients with empty/missing name", () => {
    const plan = {
      ...emptyWeek,
      Monday: {
        breakfast: makeMeal([
          { name: "", category: "X", aisle: "X", quantity: { amount: 1, unit: "g" } },
          { name: "  ", category: "X", aisle: "X", quantity: { amount: 1, unit: "g" } },
          { category: "X", aisle: "X", quantity: { amount: 1, unit: "g" } },
        ]),
        lunch: null,
        dinner: null,
      },
    };
    const result = buildShoppingItemsFromWeeklyPlan(plan);
    expect(result).toHaveLength(0);
  });

  it("handles meals with no ingredients array gracefully", () => {
    const plan = {
      ...emptyWeek,
      Monday: {
        breakfast: { id: 1, title: "Toast" },
        lunch: null,
        dinner: null,
      },
    };
    const result = buildShoppingItemsFromWeeklyPlan(plan);
    expect(result).toEqual([]);
  });

  it("defaults missing quantity to amount:0 and unit:''", () => {
    const plan = {
      ...emptyWeek,
      Monday: {
        breakfast: makeMeal([
          { name: "Salt", category: "Spices", aisle: "Spices" },
        ]),
        lunch: null,
        dinner: null,
      },
    };
    const result = buildShoppingItemsFromWeeklyPlan(plan);
    expect(result).toHaveLength(1);
    expect(result[0].amount).toBe(0);
    expect(result[0].unit).toBe("");
  });

  it("defaults missing category to 'Other'", () => {
    const plan = {
      ...emptyWeek,
      Monday: {
        breakfast: makeMeal([
          { name: "Mystery Item", quantity: { amount: 1, unit: "pc" } },
        ]),
        lunch: null,
        dinner: null,
      },
    };
    const result = buildShoppingItemsFromWeeklyPlan(plan);
    expect(result[0].category).toBe("Other");
  });

  it("handles a full week with multiple meals and ingredients", () => {
    const plan = {
      ...emptyWeek,
      Monday: {
        breakfast: makeMeal([
          { name: "Bread", category: "Bakery", aisle: "Bakery", quantity: { amount: 2, unit: "slices" } },
          { name: "Butter", category: "Dairy", aisle: "Dairy", quantity: { amount: 10, unit: "g" } },
        ]),
        lunch: makeMeal([
          { name: "Chicken", category: "Meat", aisle: "Meat", quantity: { amount: 200, unit: "g" } },
        ]),
        dinner: makeMeal([
          { name: "Rice", category: "Grains", aisle: "Grains", quantity: { amount: 150, unit: "g" } },
          { name: "Chicken", category: "Meat", aisle: "Meat", quantity: { amount: 250, unit: "g" } },
        ]),
      },
    };
    const result = buildShoppingItemsFromWeeklyPlan(plan);
    expect(result).toHaveLength(4);
    const chicken = result.find((i) => i.name === "Chicken");
    expect(chicken.amount).toBe(450);
  });

  it("is case-insensitive when merging names and units", () => {
    const plan = {
      ...emptyWeek,
      Monday: {
        breakfast: makeMeal([
          { name: "Milk", category: "Dairy", aisle: "Dairy", quantity: { amount: 100, unit: "ML" } },
        ]),
        lunch: makeMeal([
          { name: "milk", category: "Dairy", aisle: "Dairy", quantity: { amount: 200, unit: "ml" } },
        ]),
        dinner: null,
      },
    };
    const result = buildShoppingItemsFromWeeklyPlan(plan);
    expect(result).toHaveLength(1);
    expect(result[0].amount).toBe(300);
  });
});
