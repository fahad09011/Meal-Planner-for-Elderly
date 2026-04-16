import { describe, it, expect } from "vitest";
import filterMeals, { mealCountByCategory } from "./nutritionService";
import { getMaxCaloriesPerMeal, getMinCaloriesPerMeal } from "../../utils/bmr";

const makeMeal = (overrides = {}) => ({
  title: "Test Meal",
  diets: [],
  nutrition: {
    calories: 400,
    carbs: 40,
    sugar: 8,
    fiber: 10,
    sodium: 300,
    saturatedFat: 3,
    protein: 20,
    phosphorus: 200,
    calcium: 300,
    vitaminD: 3,
    iron: 6,
    folate: 80,
    vitaminB12: 1,
    vitaminC: 30,
    fat: 15,
  },
  pricePerServing: 3.5,
  mealType: "lunch",
  ...overrides,
});

const emptyProfile = { dietary: [], allergies: [], healthConditions: [], budget: "" };

describe("Layer 2: filterByDietary", () => {
  it("passes all meals when no dietary preference is set", () => {
    const meals = [makeMeal({ title: "A" }), makeMeal({ title: "B" })];
    const result = filterMeals(meals, emptyProfile);
    expect(result).toHaveLength(2);
  });

  it("passes meal with matching diet (vegetarian)", () => {
    const meals = [makeMeal({ title: "Veggie Bowl", diets: ["vegetarian"] })];
    const result = filterMeals(meals, { ...emptyProfile, dietary: ["vegetarian"] });
    expect(result).toHaveLength(1);
  });

  it("passes meal when API returns lacto_ovo_vegetarian and user selects vegetarian", () => {
    const meals = [makeMeal({ title: "Pasta", diets: ["lacto_ovo_vegetarian"] })];
    const result = filterMeals(meals, { ...emptyProfile, dietary: ["vegetarian"] });
    expect(result).toHaveLength(1);
  });

  it("passes meal when API returns vegan and user selects vegetarian (vegan is compatible)", () => {
    const meals = [makeMeal({ title: "Salad", diets: ["vegan"] })];
    const result = filterMeals(meals, { ...emptyProfile, dietary: ["vegetarian"] });
    expect(result).toHaveLength(1);
  });

  it("rejects meal with no matching diet", () => {
    const meals = [makeMeal({ title: "Steak", diets: ["primal"] })];
    const result = filterMeals(meals, { ...emptyProfile, dietary: ["vegetarian"] });
    expect(result).toHaveLength(0);
  });

  it("rejects vegan profile against lacto_ovo_vegetarian meal (vegan is stricter)", () => {
    const meals = [makeMeal({ title: "Cheese Pasta", diets: ["lacto_ovo_vegetarian"] })];
    const result = filterMeals(meals, { ...emptyProfile, dietary: ["vegan"] });
    expect(result).toHaveLength(0);
  });

  it("requires ALL selected diets to match (vegetarian AND gluten_free)", () => {
    const mealBoth = makeMeal({ title: "GF Veggie", diets: ["vegetarian", "gluten_free"] });
    const mealOne = makeMeal({ title: "Veggie Only", diets: ["vegetarian"] });
    const result = filterMeals(
      [mealBoth, mealOne],
      { ...emptyProfile, dietary: ["vegetarian", "gluten_free"] },
    );
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("GF Veggie");
  });

  it("passes meal with paleo diet (handles paleolithic alias via extractDiet)", () => {
    const meals = [makeMeal({ title: "Paleo Plate", diets: ["paleo"] })];
    const result = filterMeals(meals, { ...emptyProfile, dietary: ["paleo"] });
    expect(result).toHaveLength(1);
  });

  it("passes meal when diet array is empty and no dietary preference set", () => {
    const meals = [makeMeal({ title: "Random", diets: [] })];
    const result = filterMeals(meals, emptyProfile);
    expect(result).toHaveLength(1);
  });
});

describe("Layer 2: filterByHealthCondition", () => {
  it("passes all meals when no health conditions set", () => {
    const meals = [makeMeal()];
    const result = filterMeals(meals, emptyProfile);
    expect(result).toHaveLength(1);
  });

  it("passes meal within hypertension sodium limit (maxSodium 600)", () => {
    const meals = [makeMeal({ nutrition: { ...makeMeal().nutrition, sodium: 500 } })];
    const result = filterMeals(meals, { ...emptyProfile, healthConditions: ["hypertension"] });
    expect(result).toHaveLength(1);
  });

  it("rejects meal exceeding hypertension sodium limit", () => {
    const meals = [makeMeal({ nutrition: { ...makeMeal().nutrition, sodium: 700 } })];
    const result = filterMeals(meals, { ...emptyProfile, healthConditions: ["hypertension"] });
    expect(result).toHaveLength(0);
  });

  it("passes meal within all diabetes rules", () => {
    const nutrition = {
      ...makeMeal().nutrition,
      carbs: 50,
      sugar: 10,
      saturatedFat: 5,
      fiber: 12,
    };
    const meals = [makeMeal({ nutrition })];
    const result = filterMeals(meals, { ...emptyProfile, healthConditions: ["diabetes"] });
    expect(result).toHaveLength(1);
  });

  it("rejects meal with carbs exceeding diabetes maxCarbs (60)", () => {
    const nutrition = {
      ...makeMeal().nutrition,
      carbs: 70,
    };
    const meals = [makeMeal({ nutrition })];
    const result = filterMeals(meals, { ...emptyProfile, healthConditions: ["diabetes"] });
    expect(result).toHaveLength(0);
  });

  it("skips min rule when nutrient amount is 0 (missing data)", () => {
    const nutrition = {
      ...makeMeal().nutrition,
      carbs: 50,
      sugar: 10,
      saturatedFat: 5,
      fiber: 0,
    };
    const meals = [makeMeal({ nutrition })];
    const result = filterMeals(meals, { ...emptyProfile, healthConditions: ["diabetes"] });
    expect(result).toHaveLength(1);
  });

  it("applies multiple health conditions together", () => {
    const nutrition = {
      ...makeMeal().nutrition,
      sodium: 650,
      carbs: 50,
      sugar: 10,
      saturatedFat: 5,
      fiber: 12,
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

describe("Layer 2: meal calorie limit per profile", () => {
  it("does not filter when no calorie cap applies", () => {
    const meals = [makeMeal({ nutrition: { ...makeMeal().nutrition, calories: 2000 } })];
    const result = filterMeals(meals, emptyProfile);
    expect(result).toHaveLength(1);
  });

  it("rejects meal above weight-management per-meal calories", () => {
    const high = makeMeal({
      nutrition: { ...makeMeal().nutrition, calories: 800 },
    });
    const ok = makeMeal({
      nutrition: { ...makeMeal().nutrition, calories: 500 },
    });
    const profile = {
      ...emptyProfile,
      healthConditions: ["weightManagement"],
    };
    const result = filterMeals([high, ok], profile);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe(ok.title);
  });

  it("passes meal within TDEE-based per-meal cap", () => {
    const profile = {
      ...emptyProfile,
      age: "70",
      weightKg: "60",
      heightCm: "160",
      gender: "female",
      activityLevel: "sedentary",
    };
    const maxCalories = getMaxCaloriesPerMeal(profile);
    const minCalories = getMinCaloriesPerMeal(profile);
    expect(maxCalories).not.toBeNull();
    expect(minCalories).not.toBeNull();
    const meal = makeMeal({
      nutrition: { ...makeMeal().nutrition, calories: maxCalories - 1 },
    });
    const result = filterMeals([meal], profile);
    expect(result).toHaveLength(1);
  });

  it("rejects meal below per-meal minimum when a calorie band applies", () => {
    const profile = {
      ...emptyProfile,
      healthConditions: ["weightManagement"],
    };
    const minCalories = getMinCaloriesPerMeal(profile);
    expect(minCalories).not.toBeNull();
    const tooLight = makeMeal({
      title: "Snack",
      nutrition: { ...makeMeal().nutrition, calories: Math.max(1, minCalories - 50) },
    });
    const result = filterMeals([tooLight], profile);
    expect(result).toHaveLength(0);
  });

  it("rejects meal with missing or zero calories when a calorie cap applies", () => {
    const profile = {
      ...emptyProfile,
      healthConditions: ["weightManagement"],
    };
    const noCals = makeMeal({
      nutrition: { ...makeMeal().nutrition, calories: 0 },
    });
    const missing = makeMeal({ nutrition: undefined });
    expect(filterMeals([noCals], profile)).toHaveLength(0);
    expect(filterMeals([missing], profile)).toHaveLength(0);
  });
});

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

describe("Layer 2: filterMeals combined", () => {
  it("applies dietary + health + budget filters together", () => {
    const goodMeal = makeMeal({
      title: "Good",
      diets: ["vegetarian"],
      pricePerServing: 3,
      nutrition: { ...makeMeal().nutrition, sodium: 400 },
    });
    const badDiet = makeMeal({
      title: "Bad Diet",
      diets: ["primal"],
      pricePerServing: 3,
    });
    const badBudget = makeMeal({
      title: "Expensive",
      diets: ["vegetarian"],
      pricePerServing: 12,
    });
    const badHealth = makeMeal({
      title: "Salty",
      diets: ["vegetarian"],
      pricePerServing: 3,
      nutrition: { ...makeMeal().nutrition, sodium: 800 },
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
