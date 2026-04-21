import { describe, it, expect } from "vitest";
import { buildShoppingItemsFromWeeklyPlan } from "@/utils/buildShoppingItemsFromWeeklyPlan";

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
    expect(result[0].name).toBe("oats");
    expect(result[0].amount).toBe(100);
    expect(result[0].unit).toBe("gram");
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
    expect(result[0].name).toBe("milk");
    expect(result[0].amount).toBe(500);
  });

  it("keeps volume and weight rows separate when both exist for same item", () => {
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
    const chicken = result.find((i) => i.name === "chicken");
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

  it("normalizes noisy ingredient names before grouping", () => {
    const plan = {
      ...emptyWeek,
      Monday: {
        breakfast: makeMeal([
          { name: "Garlic cloves", category: "Produce", aisle: "Produce", quantity: { amount: 4, unit: "medium" } },
          { name: "Cloves garlic", category: "Produce", aisle: "Produce", quantity: { amount: 2, unit: "medium" } },
          { name: "Onions", category: "Produce", aisle: "Produce", quantity: { amount: 1, unit: "" } },
          { name: "onion", category: "Produce", aisle: "Produce", quantity: { amount: 2, unit: "" } },
        ]),
        lunch: null,
        dinner: null,
      },
    };

    const result = buildShoppingItemsFromWeeklyPlan(plan);
    expect(result).toHaveLength(2);

    const garlic = result.find((item) => item.name === "garlic");
    const onion = result.find((item) => item.name === "onion");

    expect(garlic.amount).toBe(6);
    expect(onion.amount).toBe(3);
  });

  it("groups close spelling variants without hardcoded ingredient mapping", () => {
    const plan = {
      ...emptyWeek,
      Monday: {
        breakfast: makeMeal([
          { name: "chili", category: "Produce", aisle: "Produce", quantity: { amount: 2, unit: "medium" } },
          { name: "chilli", category: "Produce", aisle: "Produce", quantity: { amount: 2, unit: "" } },
        ]),
        lunch: null,
        dinner: null,
      },
    };

    const result = buildShoppingItemsFromWeeklyPlan(plan);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("chili");
    expect(result[0].amount).toBe(4);
  });

  it("merges cross-family units for the same item into the closest measurable unit", () => {
    const plan = {
      ...emptyWeek,
      Monday: {
        breakfast: makeMeal([
          { name: "Parsley", category: "Produce", aisle: "Produce", quantity: { amount: 1, unit: "bunch" } },
          { name: "parsley", category: "Produce", aisle: "Produce", quantity: { amount: 3, unit: "tablespoon" } },
        ]),
        lunch: null,
        dinner: null,
      },
    };

    const result = buildShoppingItemsFromWeeklyPlan(plan);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("parsley");
    expect(result[0].unit).toBe("tablespoon");
    expect(result[0].amount).toBe(4);
  });

  it("groups plural ingredient names with generic singularization", () => {
    const plan = {
      ...emptyWeek,
      Monday: {
        breakfast: makeMeal([
          { name: "onions", category: "Produce", aisle: "Produce", quantity: { amount: 1, unit: "" } },
          { name: "onion", category: "Produce", aisle: "Produce", quantity: { amount: 2, unit: "" } },
        ]),
        lunch: null,
        dinner: null,
      },
    };

    const result = buildShoppingItemsFromWeeklyPlan(plan);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("onion");
    expect(result[0].amount).toBe(3);
  });

  it("keeps incompatible units separate after name normalization", () => {
    const plan = {
      ...emptyWeek,
      Monday: {
        breakfast: makeMeal([
          { name: "Tomatoes", category: "Produce", aisle: "Produce", quantity: { amount: 1, unit: "medium" } },
          { name: "Roma tomatoes", category: "Produce", aisle: "Produce", quantity: { amount: 0.5, unit: "cup" } },
          { name: "tomato", category: "Produce", aisle: "Produce", quantity: { amount: 1, unit: "" } },
        ]),
        lunch: null,
        dinner: null,
      },
    };

    const result = buildShoppingItemsFromWeeklyPlan(plan);
    expect(result).toHaveLength(2);
    expect(result.some((item) => item.name === "tomato")).toBe(true);
  });

  it("normalizes produce pepper variants without mixing spice pepper", () => {
    const plan = {
      ...emptyWeek,
      Monday: {
        breakfast: makeMeal([
          { name: "peppers", category: "Produce", aisle: "Produce", quantity: { amount: 2, unit: "" } },
          { name: "bell pepper", category: "Produce", aisle: "Produce", quantity: { amount: 1, unit: "" } },
          { name: "pepper", category: "Spices", aisle: "Spices", quantity: { amount: 1, unit: "teaspoon" } },
        ]),
        lunch: null,
        dinner: null,
      },
    };

    const result = buildShoppingItemsFromWeeklyPlan(plan);
    expect(result).toHaveLength(2);

    const bellPepper = result.find((item) => item.name === "bell pepper");
    const spicePepper = result.find((item) => item.name === "pepper");

    expect(bellPepper.amount).toBe(3);
    expect(spicePepper.amount).toBe(1);
  });

  it("merges same item with ml, teaspoon and tsps into existing ml unit", () => {
    const plan = {
      ...emptyWeek,
      Monday: {
        breakfast: makeMeal([
          { name: "Vanilla extract", category: "Pantry", aisle: "Baking", quantity: { amount: 100, unit: "ml" } },
          { name: "Vanilla extract", category: "Pantry", aisle: "Baking", quantity: { amount: 1, unit: "teaspoon" } },
          { name: "Vanilla extract", category: "Pantry", aisle: "Baking", quantity: { amount: 2, unit: "tsps" } },
        ]),
        lunch: null,
        dinner: null,
      },
    };

    const result = buildShoppingItemsFromWeeklyPlan(plan);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("vanilla extract");
    expect(result[0].unit).toBe("milliliter");
    expect(result[0].amount).toBe(115);
  });

  it("merges same item with gram and ounce into existing gram unit", () => {
    const plan = {
      ...emptyWeek,
      Monday: {
        breakfast: makeMeal([
          { name: "Flour", category: "Pantry", aisle: "Baking", quantity: { amount: 100, unit: "gram" } },
          { name: "Flour", category: "Pantry", aisle: "Baking", quantity: { amount: 1, unit: "ounce" } },
        ]),
        lunch: null,
        dinner: null,
      },
    };

    const result = buildShoppingItemsFromWeeklyPlan(plan);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("flour");
    expect(result[0].unit).toBe("gram");
    expect(result[0].amount).toBe(128.35);
  });

  it("forces repeated non-liquid spice rows into gram", () => {
    const plan = {
      ...emptyWeek,
      Monday: {
        breakfast: makeMeal([
          { name: "Cumin", category: "Spices", aisle: "Spices", quantity: { amount: 1, unit: "teaspoon" } },
          { name: "cumin", category: "Spices", aisle: "Spices", quantity: { amount: 2, unit: "gram" } },
          { name: "cumin", category: "Spices", aisle: "Spices", quantity: { amount: 1, unit: "serving" } },
        ]),
        lunch: null,
        dinner: null,
      },
    };

    const result = buildShoppingItemsFromWeeklyPlan(plan);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("cumin");
    expect(result[0].unit).toBe("gram");
    expect(result[0].amount).toBe(8);
  });

  it("does not merge eggs in milk/eggs dairy aisle into milliliters", () => {
    const plan = {
      ...emptyWeek,
      Monday: {
        breakfast: makeMeal([
          {
            name: "Eggs",
            category: "Dairy",
            aisle: "Milk, Eggs, Other Dairy",
            quantity: { amount: 2, unit: "" },
          },
        ]),
        lunch: null,
        dinner: null,
      },
    };

    const result = buildShoppingItemsFromWeeklyPlan(plan);
    expect(result).toHaveLength(1);
    expect(result[0].unit).not.toBe("milliliter");
    expect(result[0].unit).toBe("");
    expect(result[0].amount).toBe(2);
  });

  it("forces oil items into milliliter", () => {
    const plan = {
      ...emptyWeek,
      Monday: {
        breakfast: makeMeal([
          { name: "Olive oil", category: "Pantry", aisle: "Oil, Vinegar, Salad Dressing", quantity: { amount: 1, unit: "cup" } },
          { name: "olive oil", category: "Pantry", aisle: "Oil, Vinegar, Salad Dressing", quantity: { amount: 2, unit: "tablespoon" } },
          { name: "olive oil", category: "Pantry", aisle: "Oil, Vinegar, Salad Dressing", quantity: { amount: 100, unit: "gram" } },
        ]),
        lunch: null,
        dinner: null,
      },
    };

    const result = buildShoppingItemsFromWeeklyPlan(plan);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("olive oil");
    expect(result[0].unit).toBe("milliliter");
    expect(result[0].amount).toBe(370);
  });

  it("chooses closest existing larger unit for same item before merge", () => {
    const plan = {
      ...emptyWeek,
      Monday: {
        breakfast: makeMeal([
          { name: "Water", category: "Beverages", aisle: "Water", quantity: { amount: 900, unit: "milliliter" } },
          { name: "water", category: "Beverages", aisle: "Water", quantity: { amount: 0.3, unit: "liter" } },
        ]),
        lunch: makeMeal([
          { name: "Rice", category: "Grains", aisle: "Rice", quantity: { amount: 800, unit: "gram" } },
          { name: "rice", category: "Grains", aisle: "Rice", quantity: { amount: 0.4, unit: "kilogram" } },
        ]),
        dinner: null,
      },
    };

    const result = buildShoppingItemsFromWeeklyPlan(plan);
    const water = result.find((item) => item.name === "water");
    const rice = result.find((item) => item.name === "rice");

    expect(water.unit).toBe("liter");
    expect(water.amount).toBe(1.2);
    expect(rice.unit).toBe("kilogram");
    expect(rice.amount).toBe(1.2);
  });

});
