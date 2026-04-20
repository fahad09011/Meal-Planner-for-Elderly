function trimNonAlphanumericFromEnds(value) {
  return typeof value === "string" ?
  value.replace(/^[^a-z0-9]+|[^a-z0-9]+$/gi, "") :
  "";
}

function singularizeLastWord(value) {
  if (typeof value !== "string" || value.trim() === "") return "";
  const parts = value.split(" ");
  const lastWord = parts[parts.length - 1] || "";

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
}

function collapseRepeatedLettersAndSpaces(value) {
  return typeof value === "string" ?
  value.
  replace(/(.)\1+/g, "$1").
  replace(/\s+/g, " ").
  trim() :
  "";
}

function buildStableGroupKey(normalizedLabel) {
  return collapseRepeatedLettersAndSpaces(singularizeLastWord(normalizedLabel));
}

export function normalizeShoppingItemName(name, category = "") {
  if (typeof name !== "string" || name.trim() === "") return "";

  let normalized = trimNonAlphanumericFromEnds(name.toLowerCase().trim()).
  replace(/\s+/g, " ").
  replace(/\bor$/g, "").
  trim();

  normalized = normalized.
  replace(/^juice of lemon$/i, "lemon juice").
  replace(/^lemon juice$/, "lemon juice").
  replace(/^cloves garlic$/i, "garlic").
  replace(/^garlic cloves$/i, "garlic").
  replace(/^rosemary leaves$/i, "rosemary").
  replace(/^spinach leaves$/i, "spinach").
  replace(/^broccoli florets$/i, "broccoli").
  replace(/^cauliflower florets$/i, "cauliflower");

  normalized = normalized.
  replace(/\b(leaves|leaf|stalks|stalk|florets|floret|cloves|clove)\b/g, "").
  replace(/\s+/g, " ").
  trim();

  if (
  category === "Produce" &&
  /^(bell pepper|peppers|pepper)$/.test(normalized))
  {
    return "bell pepper";
  }

  return normalized;
}


function getNormalizedNameFromItem(itemOrString) {
  if (typeof itemOrString === "string") {
    return normalizeShoppingItemName(itemOrString, "");
  }
  if (itemOrString && typeof itemOrString === "object") {
    return normalizeShoppingItemName(itemOrString.name, itemOrString.category);
  }
  return "";
}

export function groupShoppingItemByName(items) {
  const groups = {};
  const shoppingItems = Array.isArray(items) ? items : [];

  shoppingItems.forEach((item) => {
    const normalizedName = getNormalizedNameFromItem(item);
    const groupKey = buildStableGroupKey(normalizedName);
    if (!groupKey) return;
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push({
      ...item,
      name: normalizedName
    });
  });

  const mergedEntries = Object.entries(groups).map(([groupKey, rows]) => {
    const namesShortestFirst = [...rows].
    map((row) => row.name).
    sort(
      (left, right) =>
      left.length - right.length || left.localeCompare(right)
    );
    const displayName = namesShortestFirst[0] ?? "";
    const rowsWithCanonicalName = rows.map((row) => ({
      ...row,
      name: displayName
    }));
    return [groupKey, rowsWithCanonicalName];
  });

  return Object.fromEntries(mergedEntries);
}