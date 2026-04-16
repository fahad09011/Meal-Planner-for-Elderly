/** Internal normalized units (see `normalizeUnit`) → short labels for UI. */
const DISPLAY_ABBREV = {
  gram: "g",
  kilogram: "kg",
  milliliter: "ml",
  liter: "l",
};

/**
 * @param {string} unit — normalized unit from `normalizeUnit` (e.g. "gram", "milliliter")
 * @returns {string} Abbreviation when known, otherwise original trimmed string.
 */
export function formatUnitForDisplay(unit) {
  if (typeof unit !== "string") return "";
  const key = unit.trim().toLowerCase();
  if (!key) return "";
  return DISPLAY_ABBREV[key] ?? unit.trim();
}
