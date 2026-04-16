import { dietResponseMap } from "../services/nutrition/dietMap";
export const extractSummary = (apiSummary) => {
  const summary = typeof apiSummary === "string" ? apiSummary : "";

  return summary
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

export const extractNutrition = (apiNutrition) => {
  const nutritionMap = {
    calories: "Calories",
    protein: "Protein",
    fat: "Fat",
    carbs: "Carbohydrates",
    fiber: "Fiber",
    sodium: "Sodium",
    sugar: "Sugar",
    saturatedFat: "Saturated Fat",
    phosphorus: "Phosphorus",
    calcium: "Calcium",
    vitaminD: "Vitamin D",
    iron: "Iron",
    folate: "Folate",
    vitaminB12: "Vitamin B12",
    vitaminC: "Vitamin C",
  };
  const result = {};
  const nutrients = Array.isArray(apiNutrition?.nutrients)
    ? apiNutrition.nutrients
    : [];
  Object.entries(nutritionMap).forEach(([key, mappedNutrients]) => {
    const nutrient = nutrients.find(
      (apiNut) => apiNut?.name === mappedNutrients,
    );
    result[key] = nutrient?.amount ?? 0;
    
    
  });
  return result;
};

const dinnerConditions = ["main course", "main dish"];
const lunchConditions = ["salad", "side dish", "appetizer", "soup"];
export const extractMealCategory = (apiMealType) => {
  const mealTypes = Array.isArray(apiMealType)
    ? apiMealType.map((type) => type.toLowerCase())
    : [];

  if (mealTypes.includes("breakfast")) {
    return "breakfast";
  }

  if (mealTypes.includes("lunch") && mealTypes.includes("dinner")) {
    if (lunchConditions.some((cond) => mealTypes.includes(cond))) {
      return "lunch";
    } else if (dinnerConditions.some((cond) => mealTypes.includes(cond))) {
      return "dinner";
    } else {
      return "lunch";
    }
  }

  if (mealTypes.includes("lunch")) {
    return "lunch";
  }

  if (mealTypes.includes("dinner")) {
    return "dinner";
  }

  if (dinnerConditions.some((cond) => mealTypes.includes(cond))) {
    return "dinner";
  }
  if (lunchConditions.some((cond) => mealTypes.includes(cond))) {
    return "lunch";
  }

  return "Others";
};
export const normalizeUnit = (unit)=>{
  if (typeof unit !== "string" || unit.trim() === "") {
    return "";
  }
  const normalizedunit = unit.toLowerCase().trim();
  const unitMap = {
    tsp: "teaspoon",
    tsps: "teaspoon",
    teaspoom: "teaspoon",
    teaspoon: "teaspoon",
    teaspoons: "teaspoon",

    tbsp: "tablespoon",
    tbsps: "tablespoon",
    tablespoon: "tablespoon",
    tablespoons: "tablespoon",
    tbs: "tablespoon",

    cup: "cup",
    cups: "cup",

    clove: "clove",
    cloves: "clove",

    serving: "serving",
    servings: "serving",

    oz: "ounce",
    ozs: "ounce",
    ounce: "ounce",
    ounces: "ounce",

    g: "gram",
    gram: "gram",
    grams: "gram",

    kg: "kilogram",
    kilogram: "kilogram",
    kilograms: "kilogram",

    ml: "milliliter",
    milliliter: "milliliter",
    milliliters: "milliliter",

    l: "liter",
    liter: "liter",
    liters: "liter",

    slices: "slice",
    slice: "slice",

    pieces: "piece",
    piece: "piece",

    cans: "can",
    can: "can",

    packages: "package",
    package: "package",

    lb: "pound",
    lbs: "pound",
    pound: "pound",
    pounds: "pound",

    pinch: "pinch",
    bunch: "bunch",
    handful: "handful",
    handfuls: "handful",
    stalks: "stalk",
    stalk: "stalk",
    whole: "whole",
  };
  return unitMap[normalizedunit] ?? normalizedunit
};

export const getIngredientCategory =(aisle)=>{
  if(typeof aisle !== "string" || aisle.trim() === "" || aisle.trim() === "?") {
    return "Other";
  }
  const normalizedAisle = aisle.toLowerCase().trim();
  const ingredientCategoryMap = {
    Produce: [
      "produce",
      "vegetable",
      "vegetables",
      "fruit",
      "fruits",
      "fresh herbs",
      "fresh"
    ],
  
    Dairy: [
      "milk, eggs, other dairy",
      "dairy",
      "cheese"
    ],
  
    Meat: [
      "meat",
      "pork",
      "beef",
      "chicken",
      "turkey",
      "sausage",
      "bacon"
    ],
  
    Seafood: [
      "seafood",
      "fish",
      "salmon",
      "tuna",
      "shrimp"
    ],
  
    Grains: [
      "pasta",
      "rice",
      "cereal",
      "oats",
      "grains"
    ],
  
    Pantry: [
      "canned",
      "jarred",
      "pantry",
      "baking",
      "oil",
      "vinegar",
      "salad dressing",
      "condiments",
      "ethnic foods",
      "health foods",
      "nuts",
      "nut butters",
      "jams",
      "honey"
    ],
  
    Spices: [
      "spice",
      "spices",
      "seasoning",
      "seasonings",
      "herbs"
    ],
  
    Bakery: [
      "bakery",
      "bread",
      "tortillas"
    ],
  
    Frozen: [
      "frozen"
    ],
  
    Beverages: [
      "beverage",
      "beverages",
      "tea",
      "coffee",
      "tea and coffee",
      "alcoholic beverages"
    ]
  };
  for(const [category, values] of Object.entries(ingredientCategoryMap)){
    if(values.some((value)=> normalizedAisle.includes(value))){
      return category
    }
  }
  return "Other"
};
export const cleanIngredientName = (name) => {
  if (typeof name !== "string") return "";

  return name
    .trim()
    .replace(/^(additional toppings:|optional:|for garnish:)\s*/i, "")
    .replace(/^to\s+\d+\s+/i, "")
    .replace(/\*\d+$/i, "")
    .replace(/\s+/g, " ")
    .replace(/^[,.:;)\](\s]+|[,.:;)\](\s]+$/g, "")
    .trim();
};
export const extractIngredients = (apiIngredients) => {
  const ingredients = Array.isArray(apiIngredients) ? apiIngredients : [];
  return ingredients.map((ingredient) => {
    if (ingredient == null || typeof ingredient !== "object") {
      return {
        id: null,
        name: "",
        displayName: "",
        aisle: "",
        category: "Other",
        quantity: { amount: 0, unit: "" },
        shoppingQuantity: { amount: 0, unit: "" },
        meta: []
      };
    }
    const metricAmount = ingredient?.measures?.metric?.amount;
    const metricUnit =
      ingredient?.measures?.metric?.unitShort ??
      ingredient?.measures?.metric?.unitLong ??
      "";
    return {
      id: ingredient.id ?? null,
      name: cleanIngredientName(
        ingredient.nameClean || ingredient.name || ingredient.originalName || ""
      ),
      displayName: 
      ingredient.original || 
      ingredient.originalName ||
      ingredient.nameClean || 
      ingredient.name || "",
      aisle: ingredient.aisle ?? "",
      category: getIngredientCategory(ingredient.aisle ?? ""),
      quantity: {
        amount: ingredient.amount ?? 0,
        unit: normalizeUnit(ingredient.unit ?? ""),
      },
      shoppingQuantity: {
        amount: metricAmount ?? ingredient.amount ?? 0,
        unit: normalizeUnit(metricUnit || ingredient.unit || ""),
      },
      meta: Array.isArray(ingredient.meta) ? ingredient.meta : [],
    };
  });
};

export const extractInstructions = (apiInstructions) => {
  const steps = Array.isArray(apiInstructions?.[0]?.steps)
    ? apiInstructions[0].steps
    : [];
  return steps.map((step) => {
    if (step == null || typeof step !== "object") {
      return { stepNumber: 0, description: "" };
    }
    return {
      stepNumber: step.number ?? 0,
      description: step.step ?? "",
    };
  });
};

export const extractDiet = (apiDiets) => {
  
  const diets = Array.isArray(apiDiets) ? apiDiets : [];
  const normalizedDiets = diets
  .map((diet)=> String(diet).toLowerCase().trim())
.map((diet)=> dietResponseMap[diet] ?? null)
.filter(Boolean);
return[...new Set(normalizedDiets)];  
};

export const transFormMeal = (apiMeal) => {
  if (apiMeal == null || typeof apiMeal !== "object") {
    return null;
  }
  return {
    id: apiMeal.id ?? null,
    title: apiMeal.title ?? "",
    image: apiMeal.image ?? "",
    summary: extractSummary(apiMeal.summary),
    readyInMinutes: apiMeal.readyInMinutes ?? 0,
    servings: apiMeal.servings ?? 0,
    pricePerServing: Number(((apiMeal.pricePerServing ?? 0) / 100).toFixed(2)),
    nutrition: extractNutrition(apiMeal.nutrition),
    diets: extractDiet(apiMeal.diets),
    mealType: extractMealCategory(apiMeal.dishTypes),
    ingredients: extractIngredients(apiMeal.extendedIngredients),
    instructions: extractInstructions(apiMeal.analyzedInstructions),
  };
};

