import {
  groupShoppingItemByName,
  normalizeShoppingItemName,
} from "./groupShoppingItemByName";
import { normalizeUnit } from "./transformMeal";
const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const MEAL_TYPES = ["breakfast", "lunch", "dinner"];
// { final shape
//     name: "bay leaf",
//     category: "Spices",
//     aisle: "Spices and Seasonings",
//     amount: 1,
//     unit: ""
//   }

const normalizeText = (value) => {
  if (typeof value !== "string" || value.trim() === "") return "";
  return value.toLowerCase().trim();
};

const VOLUME_UNITS = new Set(["teaspoon", "tablespoon", "cup", "milliliter", "liter"]);
const WEIGHT_UNITS = new Set(["gram", "kilogram", "ounce", "pound"]);
const GENERIC_COUNT_UNITS = new Set(["", "piece", "serving", "small", "medium", "large", "whole", "handful", "bunch", "stalk", "head", "clove", "pinch", "slice", "can", "package"]);

const VOLUME_TO_ML = {
  teaspoon: 5,
  tablespoon: 15,
  cup: 240,
  milliliter: 1,
  liter: 1000,
};

const WEIGHT_TO_G = {
  gram: 1,
  kilogram: 1000,
  ounce: 28.3495,
  pound: 453.592,
};
const LIQUID_SPICE_HINTS = [
  "extract",
  "sauce",
  "vinegar",
  "oil",
  "paste",
  "liquid",
];
const LIQUID_ITEM_HINTS = [
  "oil",
  "sauce",
  "vinegar",
  "syrup",
  "honey",
  "stock",
  "broth",
  "milk",
  "cream",
  "juice",
  "water",
  "wine",
  "extract",
  "paste",
];

const getUnitFamily = (unit) => {
  if (VOLUME_UNITS.has(unit)) return "volume";
  if (WEIGHT_UNITS.has(unit)) return "weight";
  if (GENERIC_COUNT_UNITS.has(unit)) return "count";
  return "other";
};

const chooseTargetUnitFromExisting = (units, family, totalBaseAmount = null) => {
  const uniqueUnits = Array.from(new Set(units));
  if (uniqueUnits.length === 0) return "";

  if (family === "volume") {
    if (Number.isFinite(totalBaseAmount) && totalBaseAmount > 0) {
      if (uniqueUnits.includes("liter") && totalBaseAmount >= 1000) return "liter";
      if (uniqueUnits.includes("milliliter")) return "milliliter";
    }
    if (uniqueUnits.includes("milliliter")) return "milliliter";
    if (uniqueUnits.includes("liter")) return "liter";
    if (uniqueUnits.includes("tablespoon")) return "tablespoon";
    if (uniqueUnits.includes("teaspoon")) return "teaspoon";
    if (uniqueUnits.includes("cup")) return "cup";
  }
  if (family === "weight") {
    if (Number.isFinite(totalBaseAmount) && totalBaseAmount > 0) {
      if (uniqueUnits.includes("kilogram") && totalBaseAmount >= 1000) return "kilogram";
      if (uniqueUnits.includes("gram")) return "gram";
    }
    if (uniqueUnits.includes("gram")) return "gram";
    if (uniqueUnits.includes("kilogram")) return "kilogram";
    if (uniqueUnits.includes("ounce")) return "ounce";
    if (uniqueUnits.includes("pound")) return "pound";
  }
  if (family === "count") {
    if (uniqueUnits.includes("piece")) return "piece";
    if (uniqueUnits.includes("serving")) return "serving";
    if (uniqueUnits.includes("")) return "";
  }
  return uniqueUnits[0];
};

const convertAmountToTarget = (amount, sourceUnit, targetUnit, family) => {
  const numericAmount = Number(amount ?? 0);
  if (!Number.isFinite(numericAmount) || numericAmount <= 0) return 0;
  if (sourceUnit === targetUnit) return numericAmount;

  if (family === "volume") {
    const sourceFactor = VOLUME_TO_ML[sourceUnit];
    const targetFactor = VOLUME_TO_ML[targetUnit];
    if (!sourceFactor || !targetFactor) return null;
    return (numericAmount * sourceFactor) / targetFactor;
  }

  if (family === "weight") {
    const sourceFactor = WEIGHT_TO_G[sourceUnit];
    const targetFactor = WEIGHT_TO_G[targetUnit];
    if (!sourceFactor || !targetFactor) return null;
    return (numericAmount * sourceFactor) / targetFactor;
  }

  if (family === "count") {
    // Treat generic count-like units as interchangeable counts for shopping.
    if (GENERIC_COUNT_UNITS.has(sourceUnit) && GENERIC_COUNT_UNITS.has(targetUnit)) {
      return numericAmount;
    }
    return null;
  }

  return null;
};

const convertAmountToBase = (amount, sourceUnit, family) => {
  const numericAmount = Number(amount ?? 0);
  if (!Number.isFinite(numericAmount) || numericAmount <= 0) return null;
  if (family === "volume") {
    const factor = VOLUME_TO_ML[sourceUnit];
    return factor ? numericAmount * factor : null;
  }
  if (family === "weight") {
    const factor = WEIGHT_TO_G[sourceUnit];
    return factor ? numericAmount * factor : null;
  }
  return null;
};

const isSpiceCategory = (category) =>
  String(category ?? "").toLowerCase().trim() === "spices";

const isLikelyLiquidSpice = (item) => {
  const name = String(item?.name ?? "").toLowerCase();
  const aisle = String(item?.aisle ?? "").toLowerCase();
  const unit = normalizeUnit(item?.unit ?? "");
  return (
    unit === "milliliter" ||
    unit === "liter" ||
    LIQUID_SPICE_HINTS.some((hint) => name.includes(hint) || aisle.includes(hint))
  );
};

const isLiquidItem = (item) => {
  const name = String(item?.name ?? "").toLowerCase();
  const aisle = String(item?.aisle ?? "").toLowerCase();
  const category = String(item?.category ?? "").toLowerCase();
  return (
    LIQUID_ITEM_HINTS.some((hint) => name.includes(hint) || aisle.includes(hint)) ||
    category === "beverages"
  );
};

const convertAmountToMlForLiquid = (amount, sourceUnit) => {
  const numericAmount = Number(amount ?? 0);
  if (!Number.isFinite(numericAmount) || numericAmount <= 0) return 0;
  if (VOLUME_TO_ML[sourceUnit]) return numericAmount * VOLUME_TO_ML[sourceUnit];
  if (WEIGHT_TO_G[sourceUnit]) return numericAmount * WEIGHT_TO_G[sourceUnit];
  if (GENERIC_COUNT_UNITS.has(sourceUnit)) return numericAmount;
  return numericAmount;
};

const convertAmountToGramForSpice = (amount, sourceUnit) => {
  const numericAmount = Number(amount ?? 0);
  if (!Number.isFinite(numericAmount) || numericAmount <= 0) return 0;
  if (WEIGHT_TO_G[sourceUnit]) return numericAmount * WEIGHT_TO_G[sourceUnit];
  if (VOLUME_TO_ML[sourceUnit]) return numericAmount * VOLUME_TO_ML[sourceUnit];
  if (GENERIC_COUNT_UNITS.has(sourceUnit)) return numericAmount;
  return numericAmount;
};

const mergeItemsWithUnitStrategy = (itemsWithSameName) => {
  const groupItems = Array.isArray(itemsWithSameName) ? itemsWithSameName : [];
  const shouldForceLiquidToMl =
    groupItems.length > 0 && groupItems.some((item) => isLiquidItem(item));

  if (shouldForceLiquidToMl) {
    const totalInMl = groupItems.reduce((sum, item) => {
      const normalizedUnit = normalizeUnit(item?.unit ?? "");
      return sum + convertAmountToMlForLiquid(item?.amount, normalizedUnit);
    }, 0);
    const useL = totalInMl >= 1000;
    return [
      {
        ...groupItems[0],
        unit: useL ? "liter" : "milliliter",
        amount: Number((useL ? totalInMl / 1000 : totalInMl).toFixed(2)),
      },
    ];
  }

  const shouldForceSpiceToGram =
    groupItems.length > 1 &&
    groupItems.some((item) => isSpiceCategory(item?.category)) &&
    !groupItems.some((item) => isLikelyLiquidSpice(item));

  if (shouldForceSpiceToGram) {
    const totalInGram = groupItems.reduce((sum, item) => {
      const normalizedUnit = normalizeUnit(item?.unit ?? "");
      return sum + convertAmountToGramForSpice(item?.amount, normalizedUnit);
    }, 0);
    return [
      {
        ...groupItems[0],
        unit: "gram",
        amount: Number(totalInGram.toFixed(2)),
      },
    ];
  }

  const byFamily = {};
  groupItems.forEach((item) => {
    const normalizedUnit = normalizeUnit(item?.unit ?? "");
    const family = getUnitFamily(normalizedUnit);
    const key =
      family === "count" && !GENERIC_COUNT_UNITS.has(normalizedUnit)
        ? `other:${normalizedUnit}`
        : family;

    if (!byFamily[key]) byFamily[key] = [];
    byFamily[key].push({
      ...item,
      unit: normalizedUnit,
    });
  });

  const merged = [];
  Object.entries(byFamily).forEach(([key, group]) => {
    if (!Array.isArray(group) || group.length === 0) return;

    if (key.startsWith("other:")) {
      const exactUnit = key.replace("other:", "");
      const total = group.reduce((sum, item) => sum + Number(item.amount || 0), 0);
      merged.push({
        ...group[0],
        unit: exactUnit,
        amount: Number(total.toFixed(2)),
      });
      return;
    }

    const family = key;
    const totalBaseAmount = group.reduce((sum, item) => {
      const baseAmount = convertAmountToBase(item.amount, item.unit, family);
      return sum + (baseAmount ?? 0);
    }, 0);
    const targetUnit = chooseTargetUnitFromExisting(
      group.map((item) => item.unit),
      family,
      totalBaseAmount,
    );
    let total = 0;
    let hasConvertible = false;

    group.forEach((item) => {
      const converted = convertAmountToTarget(item.amount, item.unit, targetUnit, family);
      if (converted !== null) {
        total += converted;
        hasConvertible = true;
      }
    });

    if (hasConvertible) {
      merged.push({
        ...group[0],
        unit: targetUnit,
        amount: Number(total.toFixed(2)),
      });
    } else {
      const fallbackTotal = group.reduce((sum, item) => sum + Number(item.amount || 0), 0);
      merged.push({
        ...group[0],
        unit: targetUnit,
        amount: Number(fallbackTotal.toFixed(2)),
      });
    }
  });

  if (merged.length <= 1) return merged;

  const volumeRows = merged.filter((item) => getUnitFamily(item.unit) === "volume");
  const weightRows = merged.filter((item) => getUnitFamily(item.unit) === "weight");
  const countRows = merged.filter((item) => getUnitFamily(item.unit) === "count");
  const otherRows = merged.filter((item) => getUnitFamily(item.unit) === "other");

  const measurableRows = [...volumeRows, ...weightRows];

  if (measurableRows.length === 0) return merged;

  const absorbableCount = countRows.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0,
  );

  if (absorbableCount > 0 && measurableRows.length > 0) {
    measurableRows[0] = {
      ...measurableRows[0],
      amount: Number((measurableRows[0].amount + absorbableCount).toFixed(2)),
    };
  }

  return [...measurableRows, ...otherRows];
};

export const buildShoppingItemsFromWeeklyPlan = (weeklyPlan) => {
  const rawItems = [];
  const accumulator = {};
  DAYS.forEach((day) => {
    const dayPlan = weeklyPlan?.[day];
    // console.log(day, ": Day plan:", dayPlan);
    if (!dayPlan) return;

    MEAL_TYPES.forEach((mealType) => {
      const meal = dayPlan?.[mealType];
    //   console.log(day, ": ", mealType, ":", meal);
      if (!dayPlan) return;

      const ingredients = Array.isArray(meal?.ingredients)
        ? meal?.ingredients
        : [];
      ingredients.forEach((ingredient) => {
        const rawName = String(ingredient?.name ?? "").trim();
        const category = ingredient?.category ?? "Other";
        const aisle = ingredient?.aisle ?? "";
        const shoppingAmount = ingredient?.shoppingQuantity?.amount;
        const shoppingUnit = ingredient?.shoppingQuantity?.unit;
        const amount = Number(
          shoppingAmount ?? ingredient?.quantity?.amount ?? 0
        );
        const unit = String(
          shoppingUnit ?? ingredient?.quantity?.unit ?? ""
        ).trim();
        const name = normalizeShoppingItemName(rawName, category);
        rawItems.push({
          name,
          category,
          aisle,
          amount,
          unit,
        });
      });
    });
  });

  const groupedByName = groupShoppingItemByName(rawItems);

  Object.values(groupedByName).forEach((itemsWithSameName) => {
    const mergedItems = mergeItemsWithUnitStrategy(itemsWithSameName);
    mergedItems.forEach((item) => {
      const normalizedName = normalizeText(item.name);
      const normalizedUnit = normalizeText(item.unit);

      if (!normalizedName) return;

      const key = `${normalizedName}__${normalizedUnit}`;
      if (!accumulator[key]) {
        accumulator[key] = { ...item };
      } else {
        accumulator[key].amount += item.amount;
      }
    });
  });

  return Object.values(accumulator);
};
