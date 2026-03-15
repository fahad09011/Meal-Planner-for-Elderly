// const templateMeal = {
//   id: null,
//   title: "",
//   image: "",
//   readyInMinutes: 0,
//   servings: 0,

//   diet: [],

//   mealType: "",

//   ingredients: [
//     {
//       aisle: "",
//       name: "",
//       description: "",
//       quantity: {
//         amount: 0,
//         unit: "",
//       },
//     },
//   ],

//   allergens: {},

//   nutrition: {
//     calories: { amount: 0, unit: "kcal" },
//     carbs: { amount: 0, unit: "g" },
//     protein: { amount: 0, unit: "g" },
//     fat: { amount: 0, unit: "g" },
//     fiber: { amount: 0, unit: "g" },
//     sodium: { amount: 0, unit: "mg" },
//     sugar: { amount: 0, unit: "g" },
//     calcium: { amount: 0, unit: "mg" },
//     iron: { amount: 0, unit: "mg" },
//     folate: { amount: 0, unit: "µg" },
//     phosphorus: { amount: 0, unit: "mg" },
//     saturatedFat: { amount: 0, unit: "g" },
//     vitaminB12: { amount: 0, unit: "µg" },
//     vitaminC: { amount: 0, unit: "mg" },
//     vitaminD: { amount: 0, unit: "" },
//   },

//   instructions: [
//     {
//       stepNumber: 0,
//       description: "",
//     },
//   ],

//   summary: "",
// };
import { dietResponseMap } from "../services/nutrition/dietMap";
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
  Object.entries(nutritionMap).forEach(([key, mapedNutrients]) => {
    const nutrient = nutrients.find(
      (apiNut) => apiNut?.name === mapedNutrients,
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
    summary: apiMeal.summary ?? "",
    readyInMinutes: apiMeal.readyInMinutes ?? 0,
    servings: apiMeal.servings ?? 0,
    pricePerServing: Number(((apiMeal.pricePerServing ?? 0) / 100).toFixed(2)),
    nutrition: extractNutrition(apiMeal.nutrition),
    diet: extractDiet(apiMeal.diets),
    mealType: extractMealCategory(apiMeal.dishTypes),
    ingredients: extractIngredients(apiMeal.extendedIngredients),
    instructions: extractInstructions(apiMeal.analyzedInstructions),
  };
};
