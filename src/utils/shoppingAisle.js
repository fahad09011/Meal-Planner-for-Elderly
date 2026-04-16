export function aisleLabel(item) {
  const name = String(
    item?.ingredient_name ?? item?.name ?? "",
  )
    .toLowerCase()
    .trim();
  const aisle = String(item?.aisle ?? "").toLowerCase().trim();
  const category = String(item?.category ?? "").toLowerCase().trim();

  const isEggWord = (value) => {
    if (!value) return false;
    if (/\beggplant\b/.test(value)) return false;
    if (/\begg\s*roll\b/.test(value)) return false;
    return /\b(eggs?)\b/.test(value);
  };

  const isDairyMilkWord = (value) => {
    if (!value) return false;
    if (/\bmilk\s*chocolate\b/.test(value)) return false;
    return /\bmilk\b/.test(value) || /\bbuttermilk\b/.test(value);
  };

  const isOtherDairyWord = (value) => {
    if (!value) return false;
    return (
      /\bcream\b/.test(value) ||
      /\byogurt\b/.test(value) ||
      /\b(yoghurt)\b/.test(value) ||
      /\bcheese\b/.test(value) ||
      /\bbutter\b/.test(value)
    );
  };

  // Eggs: store shelves often put them with dairy, but they are not dairy foods — own filter bucket.
  if (isEggWord(name)) {
    return "Eggs";
  }

  const looksDairyFromText = isDairyMilkWord(name) || isOtherDairyWord(name);

  const looksDairyFromAisle =
    aisle.includes("milk, eggs") ||
    aisle.includes("other dairy") ||
    aisle.includes("dairy") ||
    aisle.includes("cheese");

  if (looksDairyFromText || looksDairyFromAisle || category === "dairy") {
    return "Dairy";
  }

  const raw = (item.category || item.aisle || "").trim();
  return raw || "Other items";
}
