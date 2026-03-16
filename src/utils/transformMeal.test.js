import { describe, it, expect } from "vitest";
import { extractDiet, extractNutrition } from "./transformMeal";

// ═══════════════════════════════════════════════════════
// extractDiet: API response → normalized system diet tags
// ═══════════════════════════════════════════════════════
describe("extractDiet (API → normalized diet tags)", () => {
  it("normalizes 'Lacto-Ovo-Vegetarian' → 'lacto_ovo_vegetarian'", () => {
    expect(extractDiet(["Lacto-Ovo-Vegetarian"])).toContain("lacto_ovo_vegetarian");
  });

  it("normalizes 'Paleolithic' → 'paleo'", () => {
    expect(extractDiet(["Paleolithic"])).toContain("paleo");
  });

  it("normalizes 'Vegetarian' → 'vegetarian'", () => {
    expect(extractDiet(["Vegetarian"])).toContain("vegetarian");
  });

  it("normalizes 'Vegan' → 'vegan'", () => {
    expect(extractDiet(["Vegan"])).toContain("vegan");
  });

  it("normalizes 'Gluten Free' → 'gluten_free'", () => {
    expect(extractDiet(["Gluten Free"])).toContain("gluten_free");
  });

  it("normalizes 'Pescetarian' → 'pescetarian'", () => {
    expect(extractDiet(["Pescetarian"])).toContain("pescetarian");
  });

  it("normalizes 'Lacto-Vegetarian' → 'lacto_vegetarian'", () => {
    expect(extractDiet(["Lacto-Vegetarian"])).toContain("lacto_vegetarian");
  });

  it("normalizes 'Ovo-Vegetarian' → 'ovo_vegetarian'", () => {
    expect(extractDiet(["Ovo-Vegetarian"])).toContain("ovo_vegetarian");
  });

  it("normalizes 'Whole30' → 'whole30'", () => {
    expect(extractDiet(["Whole30"])).toContain("whole30");
  });

  it("normalizes 'Primal' → 'primal'", () => {
    expect(extractDiet(["Primal"])).toContain("primal");
  });

  it("handles multiple API diets and deduplicates", () => {
    const result = extractDiet(["Lacto-Ovo-Vegetarian", "Gluten Free", "Vegan"]);
    expect(result).toContain("lacto_ovo_vegetarian");
    expect(result).toContain("gluten_free");
    expect(result).toContain("vegan");
    expect(new Set(result).size).toBe(result.length);
  });

  it("filters out unknown/unmapped diet tags", () => {
    const result = extractDiet(["SomeRandomDiet"]);
    expect(result).toHaveLength(0);
  });

  it("handles empty array", () => {
    expect(extractDiet([])).toEqual([]);
  });

  it("handles undefined/null input", () => {
    expect(extractDiet(undefined)).toEqual([]);
    expect(extractDiet(null)).toEqual([]);
  });

  it("handles case insensitivity (lowercase input)", () => {
    expect(extractDiet(["lacto-ovo-vegetarian"])).toContain("lacto_ovo_vegetarian");
    expect(extractDiet(["paleolithic"])).toContain("paleo");
  });
});

// ═══════════════════════════════════════════════════════
// extractNutrition: API nutrition → system nutrition object
// ═══════════════════════════════════════════════════════
describe("extractNutrition", () => {
  it("extracts nutrients from API nutrients array", () => {
    const apiNutrition = {
      nutrients: [
        { name: "Calories", amount: 450, unit: "kcal" },
        { name: "Sodium", amount: 350, unit: "mg" },
        { name: "Fiber", amount: 8, unit: "g" },
        { name: "Sugar", amount: 12, unit: "g" },
        { name: "Saturated Fat", amount: 4, unit: "g" },
        { name: "Carbohydrates", amount: 55, unit: "g" },
        { name: "Protein", amount: 25, unit: "g" },
      ],
    };
    const result = extractNutrition(apiNutrition);
    expect(result.calories).toEqual({ amount: 450, unit: "kcal" });
    expect(result.sodium).toEqual({ amount: 350, unit: "mg" });
    expect(result.fiber).toEqual({ amount: 8, unit: "g" });
    expect(result.sugar).toEqual({ amount: 12, unit: "g" });
    expect(result.saturatedFat).toEqual({ amount: 4, unit: "g" });
    expect(result.carbs).toEqual({ amount: 55, unit: "g" });
    expect(result.protein).toEqual({ amount: 25, unit: "g" });
  });

  it("defaults to 0 for missing nutrients", () => {
    const result = extractNutrition({ nutrients: [] });
    expect(result.calories.amount).toBe(0);
    expect(result.sodium.amount).toBe(0);
    expect(result.fiber.amount).toBe(0);
  });

  it("handles undefined/null input", () => {
    const result = extractNutrition(undefined);
    expect(result.calories.amount).toBe(0);
    expect(result.sodium.amount).toBe(0);
  });
});
