const stripOuterPunctuation = (value) =>
  value.replace(/^[^a-z0-9]+|[^a-z0-9]+$/gi, "");

const singularizeLastWord = (value) => {
  if (typeof value !== "string" || value.trim() === "") return "";
  const parts = value.split(" ");
  const lastWord = parts[parts.length - 1];

  let singular = lastWord;
  if (/ies$/i.test(lastWord) && lastWord.length > 3) {
    singular = lastWord.replace(/ies$/i, "y");
  } else if (/(oes|xes|zes|ches|shes)$/i.test(lastWord)) {
    singular = lastWord.replace(/es$/i, "");
  } else if (/s$/i.test(lastWord) && !/(ss|us|is)$/i.test(lastWord)) {
    singular = lastWord.replace(/s$/i, "");
  }

  parts[parts.length - 1] = singular;
  return parts.join(" ").trim();
};

const buildLooseGroupKey = (value) =>
  value
    .replace(/(.)\1+/g, "$1")
    .replace(/\s+/g, " ")
    .trim();

const buildGroupingKey = (value) => buildLooseGroupKey(singularizeLastWord(value));

export const normalizeShoppingItemName = (name, category = "") => {
  if (typeof name !== "string" || name.trim() === "") return "";

  let normalized = stripOuterPunctuation(name.toLowerCase().trim())
    .replace(/\s+/g, " ")
    .replace(/\bor$/g, "")
    .trim();

  // Common noisy phrases from Spoonacular ingredient names.
  normalized = normalized
    .replace(/^juice of lemon$/i, "lemon juice")
    .replace(/^lemon juice$/, "lemon juice")
    .replace(/^cloves garlic$/i, "garlic")
    .replace(/^garlic cloves$/i, "garlic")
    .replace(/^rosemary leaves$/i, "rosemary")
    .replace(/^spinach leaves$/i, "spinach")
    .replace(/^broccoli florets$/i, "broccoli")
    .replace(/^cauliflower florets$/i, "cauliflower");

  // Remove count-form suffixes after matching direct aliases.
  normalized = normalized
    .replace(/\b(leaves|leaf|stalks|stalk|florets|floret|cloves|clove)\b/g, "")
    .replace(/\s+/g, " ")
    .trim();

  // Keep spice pepper separate from produce peppers.
  if (category === "Produce" && /^(bell pepper|peppers|pepper)$/.test(normalized)) {
    return "bell pepper";
  }

  return normalized;
};

const normalizeGroupKey = (item) => {
  const name = typeof item === "string" ? item : item?.name;
  const category = typeof item === "string" ? "" : item?.category;
  return normalizeShoppingItemName(name, category);
};

export const groupShoppingItemByName = (items) => {
  const groups = {};
  const shoppingItems = Array.isArray(items) ? items : [];
  shoppingItems.forEach((item) => {
    const normalizedName = normalizeGroupKey(item);
    const groupKey = buildGroupingKey(normalizedName);
    if (!groupKey) return;
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push({
      ...item,
      name: normalizedName,
    });
  });
  return Object.fromEntries(
    Object.entries(groups).map(([key, group]) => {
      const canonicalName = [...group]
        .map((item) => item.name)
        .sort((left, right) => left.length - right.length || left.localeCompare(right))[0];
      return [
        key,
        group.map((item) => ({
          ...item,
          name: canonicalName,
        })),
      ];
    }),
  );
};
