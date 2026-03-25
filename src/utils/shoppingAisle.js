/** Category / aisle label used for grouping and filtering (matches DB fields). */
export function aisleLabel(item) {
  const raw = (item.category || item.aisle || "").trim();
  return raw || "Other items";
}
