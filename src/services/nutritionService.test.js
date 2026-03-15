import { describe, it, expect } from "vitest";
import filterMeals, { mealCountByCategory } from "./nutritionService";

// ──── helpers ────
const makeMeal = (overrides = {}) => ({
  title: "Test Meal",
  diet: [],
  nutrition: {
    calories: { amount: 400, unit: "kcal" },
    carbs: { amount: 40, unit: "g" },
    sugar: { amount: 8, unit: "g" },
    fiber: { amount: 10, unit: "g" },
    sodium: { amount: 300, unit: "mg" },
    saturatedFat: { amount: 3, unit: "g" },
    protein: { amount: 20, unit: "g" },
    phosphorus: { amount: 200, unit: "mg" },
    calcium: { amount: 300, unit: "mg" },
    vitaminD: { amount: 3, unit: "µg" },
    iron: { amount: 6, unit: "mg" },
    folate: { amount: 80, unit: "µg" },
    vitaminB12: { amount: 1, unit: "µg" },
    vitaminC: { amount: 30, unit: "mg" },
    fat: { amount: 15, unit: "g" },
  },
  pricePerServing: 3.5,
  mealType: "lunch",
  ...overrides,
});

const emptyProfile = { dietary: [], allergies: [], healthConditions: [], budget: "" };

// ═══════════════════════════════════════════════════════
// Layer 2: filterByDietary
// ═══════════════════════════════════════════════════════
describe("Layer 2: filterByDietary", () => {
  it("passes all meals when no dietary preference is set", () => {
    const meals = [makeMeal({ title: "A" }), makeMeal({ title: "B" })];
    const result = filterMeals(meals, emptyProfile);
    expect(result).toHaveLength(2);
  });

  it("passes meal with matching diet (vegetarian)", () => {
    const meals = [makeMeal({ title: "Veggie Bowl", diet: ["vegetarian"] })];
    const result = filterMeals(meals, { ...emptyProfile, dietary: ["vegetarian"] });
    expect(result).toHaveLength(1);
  });

  it("passes meal when API returns lacto_ovo_vegetarian and user selects vegetarian", () => {
    const meals = [makeMeal({ title: "Pasta", diet: ["lacto_ovo_vegetarian"] })];
    const result = filterMeals(meals, { ...emptyProfile, dietary: ["vegetarian"] });
    expect(result).toHaveLength(1);
  });

  it("passes meal when API returns vegan and user selects vegetarian (vegan is compatible)", () => {
    const meals = [makeMeal({ title: "Salad", diet: ["vegan"] })];
    const result = filterMeals(meals, { ...emptyProfile, dietary: ["vegetarian"] });
    expect(result).toHaveLength(1);
  });

  it("rejects meal with no matching diet", () => {
    const meals = [makeMeal({ title: "Steak", diet: ["primal"] })];
    const result = filterMeals(meals, { ...emptyProfile, dietary: ["vegetarian"] });
    expect(result).toHaveLength(0);
  });

  it("rejects vegan profile against lacto_ovo_vegetarian meal (vegan is stricter)", () => {
    const meals = [makeMeal({ title: "Cheese Pasta", diet: ["lacto_ovo_vegetarian"] })];
    const result = filterMeals(meals, { ...emptyProfile, dietary: ["vegan"] });
    expect(result).toHaveLength(0);
  });

  it("requires ALL selected diets to match (vegetarian AND gluten_free)", () => {
    const mealBoth = makeMeal({ title: "GF Veggie", diet: ["vegetarian", "gluten_free"] });
    const mealOne = makeMeal({ title: "Veggie Only", diet: ["vegetarian"] });
    const result = filterMeals(
      [mealBoth, mealOne],
      { ...emptyProfile, dietary: ["vegetarian", "gluten_free"] },
    );
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("GF Veggie");
  });

  it("passes meal with paleo diet (handles paleolithic alias via extractDiet)", () => {
    const meals = [makeMeal({ title: "Paleo Plate", diet: ["paleo"] })];
    const result = filterMeals(meals, { ...emptyProfile, dietary: ["paleo"] });
    expect(result).toHaveLength(1);
  });

  it("passes meal when diet array is empty and no dietary preference set", () => {
    const meals = [makeMeal({ title: "Random", diet: [] })];
    const result = filterMeals(meals, emptyProfile);
    expect(result).toHaveLength(1);
  });
});

// ═══════════════════════════════════════════════════════
// Layer 2: filterByHealthCondition
// ═══════════════════════════════════════════════════════
describe("Layer 2: filterByHealthCondition", () => {
  it("passes all meals when no health conditions set", () => {
    const meals = [makeMeal()];
    const result = filterMeals(meals, emptyProfile);
    expect(result).toHaveLength(1);
  });

  it("passes meal within hypertension sodium limit (maxSodium 600)", () => {
    const meals = [makeMeal({ nutrition: { ...makeMeal().nutrition, sodium: { amount: 500, unit: "mg" } } })];
    const result = filterMeals(meals, { ...emptyProfile, healthConditions: ["hypertension"] });
    expect(result).toHaveLength(1);
  });

  it("rejects meal exceeding hypertension sodium limit", () => {
    const meals = [makeMeal({ nutrition: { ...makeMeal().nutrition, sodium: { amount: 700, unit: "mg" } } })];
    const result = filterMeals(meals, { ...emptyProfile, healthConditions: ["hypertension"] });
    expect(result).toHaveLength(0);
  });

  it("passes meal within all diabetes rules", () => {
    const nutrition = {
      ...makeMeal().nutrition,
      carbs: { amount: 50, unit: "g" },
      sugar: { amount: 10, unit: "g" },
      saturatedFat: { amount: 5, unit: "g" },
      fiber: { amount: 12, unit: "g" },
    };
    const meals = [makeMeal({ nutrition })];
    const result = filterMeals(meals, { ...emptyProfile, healthConditions: ["diabetes"] });
    expect(result).toHaveLength(1);
  });

  it("rejects meal with carbs exceeding diabetes maxCarbs (60)", () => {
    const nutrition = {
      ...makeMeal().nutrition,
      carbs: { amount: 70, unit: "g" },
    };
    const meals = [makeMeal({ nutrition })];
    const result = filterMeals(meals, { ...emptyProfile, healthConditions: ["diabetes"] });
    expect(result).toHaveLength(0);
  });

  it("skips min rule when nutrient amount is 0 (missing data)", () => {
    const nutrition = {
      ...makeMeal().nutrition,
      carbs: { amount: 50, unit: "g" },
      sugar: { amount: 10, unit: "g" },
      saturatedFat: { amount: 5, unit: "g" },
      fiber: { amount: 0, unit: "g" },
    };
    const meals = [makeMeal({ nutrition })];
    const result = filterMeals(meals, { ...emptyProfile, healthConditions: ["diabetes"] });
    expect(result).toHaveLength(1);
  });

  it("applies multiple health conditions together", () => {
    const nutrition = {
      ...makeMeal().nutrition,
      sodium: { amount: 650, unit: "mg" },
      carbs: { amount: 50, unit: "g" },
      sugar: { amount: 10, unit: "g" },
      saturatedFat: { amount: 5, unit: "g" },
      fiber: { amount: 12, unit: "g" },
    };
    const meals = [makeMeal({ nutrition })];
    const result = filterMeals(meals, { ...emptyProfile, healthConditions: ["hypertension", "diabetes"] });
    expect(result).toHaveLength(0);
  });

  it("ignores unknown health conditions", () => {
    const meals = [makeMeal()];
    const result = filterMeals(meals, { ...emptyProfile, healthConditions: ["unknownCondition"] });
    expect(result).toHaveLength(1);
  });

  it("passes when meal.nutrition is missing entirely", () => {
    const meals = [makeMeal({ nutrition: undefined })];
    const result = filterMeals(meals, { ...emptyProfile, healthConditions: ["hypertension"] });
    expect(result).toHaveLength(1);
  });
});

// ═══════════════════════════════════════════════════════
// Layer 2: filterByBudget
// ═══════════════════════════════════════════════════════
describe("Layer 2: filterByBudget", () => {
  it("passes all meals when no budget set", () => {
    const meals = [makeMeal({ pricePerServing: 100 })];
    const result = filterMeals(meals, emptyProfile);
    expect(result).toHaveLength(1);
  });

  it("passes low budget meal (price <= $4)", () => {
    const meals = [makeMeal({ pricePerServing: 3.5 })];
    const result = filterMeals(meals, { ...emptyProfile, budget: "low" });
    expect(result).toHaveLength(1);
  });

  it("rejects low budget meal (price > $4)", () => {
    const meals = [makeMeal({ pricePerServing: 5.0 })];
    const result = filterMeals(meals, { ...emptyProfile, budget: "low" });
    expect(result).toHaveLength(0);
  });

  it("passes medium budget meal (price <= $8)", () => {
    const meals = [makeMeal({ pricePerServing: 7.5 })];
    const result = filterMeals(meals, { ...emptyProfile, budget: "medium" });
    expect(result).toHaveLength(1);
  });

  it("rejects medium budget meal (price > $8)", () => {
    const meals = [makeMeal({ pricePerServing: 9.0 })];
    const result = filterMeals(meals, { ...emptyProfile, budget: "medium" });
    expect(result).toHaveLength(0);
  });

  it("passes any price for flexible budget", () => {
    const meals = [makeMeal({ pricePerServing: 50 })];
    const result = filterMeals(meals, { ...emptyProfile, budget: "flexible" });
    expect(result).toHaveLength(1);
  });

  it("passes meal with invalid/missing price (cannot enforce budget)", () => {
    const meals = [makeMeal({ pricePerServing: undefined })];
    const result = filterMeals(meals, { ...emptyProfile, budget: "low" });
    expect(result).toHaveLength(1);
  });
});

// ═══════════════════════════════════════════════════════
// Layer 2: filterMeals (combined) + mealCountByCategory
// ═══════════════════════════════════════════════════════
describe("Layer 2: filterMeals combined", () => {
  it("applies dietary + health + budget filters together", () => {
    const goodMeal = makeMeal({
      title: "Good",
      diet: ["vegetarian"],
      pricePerServing: 3,
      nutrition: { ...makeMeal().nutrition, sodium: { amount: 400, unit: "mg" } },
    });
    const badDiet = makeMeal({
      title: "Bad Diet",
      diet: ["primal"],
      pricePerServing: 3,
    });
    const badBudget = makeMeal({
      title: "Expensive",
      diet: ["vegetarian"],
      pricePerServing: 12,
    });
    const badHealth = makeMeal({
      title: "Salty",
      diet: ["vegetarian"],
      pricePerServing: 3,
      nutrition: { ...makeMeal().nutrition, sodium: { amount: 800, unit: "mg" } },
    });

    const profile = {
      dietary: ["vegetarian"],
      allergies: [],
      healthConditions: ["hypertension"],
      budget: "low",
    };

    const result = filterMeals([goodMeal, badDiet, badBudget, badHealth], profile);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Good");
  });
});

describe("mealCountByCategory", () => {
  it("counts meals by mealType", () => {
    const meals = [
      makeMeal({ mealType: "breakfast" }),
      makeMeal({ mealType: "breakfast" }),
      makeMeal({ mealType: "lunch" }),
      makeMeal({ mealType: "dinner" }),
      makeMeal({ mealType: "dinner" }),
      makeMeal({ mealType: "dinner" }),
    ];
    const count = mealCountByCategory(meals);
    expect(count).toEqual({ breakfast: 2, lunch: 1, dinner: 3 });
  });

  it("returns zeros for empty list", () => {
    expect(mealCountByCategory([])).toEqual({ breakfast: 0, lunch: 0, dinner: 0 });
  });
});
