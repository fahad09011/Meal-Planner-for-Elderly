import { describe, it, expect } from "vitest";
import { aisleLabel } from "./shoppingAisle";

describe("aisleLabel", () => {
  it("groups milk under Dairy even when aisle is Beverages", () => {
    expect(
      aisleLabel({
        ingredient_name: "Milk",
        category: "Beverages",
        aisle: "Milk",
      }),
    ).toBe("Dairy");
  });

  it("groups eggs under Dairy when Spoonacular aisle is milk/eggs dairy", () => {
    expect(
      aisleLabel({
        ingredient_name: "Eggs",
        category: "Dairy",
        aisle: "Milk, Eggs, Other Dairy",
      }),
    ).toBe("Dairy");
  });

  it("does not treat eggplant as eggs", () => {
    expect(
      aisleLabel({
        ingredient_name: "Eggplant",
        category: "Produce",
        aisle: "Produce",
      }),
    ).toBe("Produce");
  });
});
