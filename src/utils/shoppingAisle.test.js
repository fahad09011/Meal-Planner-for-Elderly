import { describe, it, expect } from "vitest";
import { aisleLabel } from "./shoppingAisle";

describe("aisleLabel", () => {
  it("returns category when present", () => {
    expect(aisleLabel({ category: "Dairy" })).toBe("Dairy");
  });

  it("falls back to aisle when category is empty", () => {
    expect(aisleLabel({ category: "", aisle: "Frozen Foods" })).toBe("Frozen Foods");
  });

  it("returns 'Other items' when both are empty", () => {
    expect(aisleLabel({ category: "", aisle: "" })).toBe("Other items");
  });

  it("returns 'Other items' when both are missing", () => {
    expect(aisleLabel({})).toBe("Other items");
  });

  it("trims whitespace from category", () => {
    expect(aisleLabel({ category: "  Spices  " })).toBe("Spices");
  });

  it("trims whitespace from aisle fallback", () => {
    expect(aisleLabel({ category: "", aisle: "  Bakery  " })).toBe("Bakery");
  });

  it("prefers category over aisle when both are present", () => {
    expect(aisleLabel({ category: "Meat", aisle: "Butcher" })).toBe("Meat");
  });
});
