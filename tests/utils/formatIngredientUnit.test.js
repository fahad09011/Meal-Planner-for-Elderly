import { describe, it, expect } from "vitest";
import { formatUnitForDisplay } from "@/utils/formatIngredientUnit";

describe("formatUnitForDisplay", () => {
  it("abbreviates metric mass and volume", () => {
    expect(formatUnitForDisplay("gram")).toBe("g");
    expect(formatUnitForDisplay("kilogram")).toBe("kg");
    expect(formatUnitForDisplay("milliliter")).toBe("ml");
    expect(formatUnitForDisplay("liter")).toBe("l");
  });

  it("passes through unknown units", () => {
    expect(formatUnitForDisplay("teaspoon")).toBe("teaspoon");
    expect(formatUnitForDisplay("")).toBe("");
  });
});
