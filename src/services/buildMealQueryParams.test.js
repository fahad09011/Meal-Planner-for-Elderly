import { describe, it, expect } from "vitest";
import buildMealQueryParams from "./buildMealQueryParams";

const emptyProfile = { dietary: [], allergies: [], healthConditions: [], budget: "" };

describe("Layer 1: buildMealQueryParams", () => {

  describe("base params", () => {
    it("always includes addRecipeNutrition, addRecipeInformation, type, number", () => {
      const params = buildMealQueryParams(emptyProfile);
      expect(params.addRecipeNutrition).toBe(true);
      expect(params.addRecipeInformation).toBe(true);
      expect(params.addRecipeInstructions).toBe(true);
      expect(params.fillIngredients).toBe(true);
      expect(params.type).toBe("breakfast,lunch,dinner");
      expect(params.number).toBe(20);
    });

    it("does not include diet, intolerances, or nutrition params for empty profile", () => {
      const params = buildMealQueryParams(emptyProfile);
      expect(params.diet).toBeUndefined();
      expect(params.intolerances).toBeUndefined();
      expect(params.maxCarbs).toBeUndefined();
      expect(params.maxSodium).toBeUndefined();
    });
  });

  describe("dietary → params.diet", () => {
    it("maps vegetarian to API value", () => {
      const params = buildMealQueryParams({ ...emptyProfile, dietary: ["vegetarian"] });
      expect(params.diet).toBe("vegetarian");
    });

    it("maps gluten_free to 'gluten free'", () => {
      const params = buildMealQueryParams({ ...emptyProfile, dietary: ["gluten_free"] });
      expect(params.diet).toBe("gluten free");
    });

    it("maps paleo to API value", () => {
      const params = buildMealQueryParams({ ...emptyProfile, dietary: ["paleo"] });
      expect(params.diet).toBe("paleo");
    });

    it("joins multiple diets with comma", () => {
      const params = buildMealQueryParams({ ...emptyProfile, dietary: ["vegetarian", "gluten_free"] });
      expect(params.diet).toBe("vegetarian,gluten free");
    });

    it("skips unknown diet keys", () => {
      const params = buildMealQueryParams({ ...emptyProfile, dietary: ["unknown_diet"] });
      expect(params.diet).toBeUndefined();
    });
  });

  describe("allergies → params.intolerances", () => {
    it("maps dairy allergy", () => {
      const params = buildMealQueryParams({ ...emptyProfile, allergies: ["dairy"] });
      expect(params.intolerances).toBe("dairy");
    });

    it("maps peanut allergy", () => {
      const params = buildMealQueryParams({ ...emptyProfile, allergies: ["peanut"] });
      expect(params.intolerances).toBe("peanut");
    });

    it("joins multiple allergies", () => {
      const params = buildMealQueryParams({ ...emptyProfile, allergies: ["dairy", "gluten"] });
      expect(params.intolerances).toBe("dairy,gluten");
    });

    it("skips unknown allergy keys", () => {
      const params = buildMealQueryParams({ ...emptyProfile, allergies: ["nuts"] });
      expect(params.intolerances).toBeUndefined();
    });
  });

  describe("healthConditions → nutrition params", () => {
    it("adds diabetes rules (maxCarbs, maxSugar, maxSaturatedFat, minFiber)", () => {
      const params = buildMealQueryParams({ ...emptyProfile, healthConditions: ["diabetes"] });
      expect(params.maxCarbs).toBe(60);
      expect(params.maxSugar).toBe(12);
      expect(params.maxSaturatedFat).toBe(6.5);
      expect(params.minFiber).toBe(9);
    });

    it("adds hypertension rules (maxSodium)", () => {
      const params = buildMealQueryParams({ ...emptyProfile, healthConditions: ["hypertension"] });
      expect(params.maxSodium).toBe(600);
    });

    it("adds kidneyDisease rules", () => {
      const params = buildMealQueryParams({ ...emptyProfile, healthConditions: ["kidneyDisease"] });
      expect(params.maxSodium).toBe(675);
      expect(params.maxProtein).toBe(17.5);
      expect(params.maxPhosphorus).toBe(300);
    });

    it("merges multiple health conditions (strictest value wins for shared keys)", () => {
      const params = buildMealQueryParams({
        ...emptyProfile,
        healthConditions: ["hypertension", "heartDisease"],
      });
      expect(params.maxSodium).toBe(575);
      expect(params.maxSaturatedFat).toBe(4.5);
      expect(params.minFiber).toBe(9);
    });

    it("ignores unknown health conditions", () => {
      const params = buildMealQueryParams({ ...emptyProfile, healthConditions: ["unknownCondition"] });
      expect(params.maxSodium).toBeUndefined();
    });
  });

  describe("combined profile", () => {
    it("includes diet, intolerances, and nutrition params together", () => {
      const params = buildMealQueryParams({
        dietary: ["vegetarian"],
        allergies: ["dairy", "peanut"],
        healthConditions: ["diabetes"],
        budget: "low",
      });
      expect(params.diet).toBe("vegetarian");
      expect(params.intolerances).toBe("dairy,peanut");
      expect(params.maxCarbs).toBe(60);
      expect(params.maxSugar).toBe(12);
    });
  });
});
