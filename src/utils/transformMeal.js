const meal = {
  id: null,
  title: "",
  image: "",
  readyInMinutes: 0,
  servings: 0,

  diets: {},

  mealType: "",

  ingredients: [
    {
      name: "",
      aisle: "",
      amount: 0,
      unit: "",
    },
  ],

  allergens: {},
  nutrition: {
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
    fiber: 0,
    sodium: 0,
    sugar: 0,
  },

  instructions: [
    {
      step: 0,
      text: "",
    },
  ],

  summary: "",
};

export const extractNutrition = (apiNutrition) => {
  const nutritionsMap = {
    calories: "Calories",
    protein: "Protein",
    fat: "Fat",
    carbs: "Carbohydrates",
    fiber: "Fiber",
    sodium: "Sodium",
    sugar: "Sugar",
  };
  const result = {};
  const nutrients = Array.isArray(apiNutrition?.nutrients)
    ? apiNutrition.nutrients
    : [];
  Object.entries(nutritionsMap).forEach(([key, mappedNutrients]) => {
    const nutrient = nutrients.find(
      (apiNut) => apiNut?.name === mappedNutrients,
    );
    result[key] = {
      amount: nutrient?.amount ?? 0,
      unit: nutrient?.unit ?? "",
    };
  });
  return result;
};
const breakFastConditions = ["breakfast"];
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

  return "others";
};
export const extractIngredients = (apiIngredients) => {
  const ingredients = Array.isArray(apiIngredients) ? apiIngredients : [];
  return ingredients.map((ingredient) => {
    if (ingredient == null || typeof ingredient !== "object") {
      return {
        aisle: "",
        name: "",
        description: "",
        quantity: { amount: 0, unit: "" },
      };
    }
    return {
      aisle: ingredient.aisle ?? "",
      name: ingredient.name ?? "",
      description: ingredient.original ?? "",
      quantity: {
        amount: ingredient.amount ?? 0,
        unit: ingredient.unit ?? "",
      },
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
  const diet = Array.isArray(apiDiets) ? apiDiets : [];
  return diet;
};

export const transFormMeal = (apiMeal) => {
  if (apiMeal == null || typeof apiMeal !== "object") {
    return null;
  }
  return {
    id: apiMeal.id ?? null,
    title: apiMeal.title ?? "",
    img: apiMeal.image ?? "",
    summary: apiMeal.summary ?? "",
    readyInMinutes: apiMeal.readyInMinutes ?? 0,
    servings: apiMeal.servings ?? 0,
    nutrition: extractNutrition(apiMeal.nutrition),
    diet: extractDiet(apiMeal.diets),
    mealType: extractMealCategory(apiMeal.dishTypes),
    // mealType: Array.isArray(apiMeal.dishTypes) ? apiMeal.dishTypes : [],
    ingredients: extractIngredients(apiMeal.extendedIngredients),
    instructions: extractInstructions(apiMeal.analyzedInstructions),
  };
};
