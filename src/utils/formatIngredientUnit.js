
const DISPLAY_ABBREV = {
  gram: "g",
  kilogram: "kg",
  milliliter: "ml",
  liter: "l"
};





export function formatUnitForDisplay(unit) {
  if (typeof unit !== "string") return "";
  const key = unit.trim().toLowerCase();
  if (!key) return "";
  return DISPLAY_ABBREV[key] ?? unit.trim();
}