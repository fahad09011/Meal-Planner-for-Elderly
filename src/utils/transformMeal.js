// const templateMeal = {
//   id: null,
//   title: "",
//   image: "",
//   readyInMinutes: 0,
//   servings: 0,
//   pricePerServing: 0,
//
//   diets: [],
//
//   mealType: "",
//
//   ingredients: [
//     {
//       aisle: "",
//       name: "",
//       description: "",
//       quantity: { amount: 0, unit: "" },
//     },
//   ],
//
//   nutrition: {
//     calories: 0,      // kcal
//     carbs: 0,          // g
//     protein: 0,        // g
//     fat: 0,            // g
//     fiber: 0,          // g
//     sodium: 0,         // mg
//     sugar: 0,          // g
//     calcium: 0,        // mg
//     iron: 0,           // mg
//     folate: 0,         // µg
//     phosphorus: 0,     // mg
//     saturatedFat: 0,   // g
//     vitaminB12: 0,     // µg
//     vitaminC: 0,       // mg
//     vitaminD: 0,
//   },
//
//   instructions: [
//     { stepNumber: 0, description: "" },
//   ],
//
//   summary: "",
// };
import { dietResponseMap } from "../services/nutrition/dietMap";
export const extractSummary = (apiSummary) => {
  const summary = typeof apiSummary === "string" ? apiSummary : "";

  return summary
    .replace(/<[^>]*>/g, "")   // remove HTML tags
    .replace(/\s+/g, " ")      // collapse multiple spaces
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
  Object.entries(nutritionMap).forEach(([key, mapedNutrients]) => {
    const nutrient = nutrients.find(
      (apiNut) => apiNut?.name === mapedNutrients,
    );
    result[key] = nutrient?.amount ?? 0;
    
    
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
export const getIngredientCategory =(aisle)=>{
  if(typeof aisle !== "string" || aisle.trim() === "" || aisle.trim() === "?") {
    return "other";
  }
  const normalizedAisle = aisle.toLowerCase().trim();
  const ingredientCategoryMap = {
    Produce: ["produce", "vegetable", "vegetables", "fruit", "fruits", "fresh herbs", "fresh"],
    Dairy: ["dairy", "milk", "eggs", "cheese", "yogurt", "butter"],
    Meat: ["meat", "pork", "beef", "chicken", "turkey", "sausage", "bacon"],
    Seafood: ["seafood", "fish", "salmon", "tuna", "shrimp"],
    Grains: ["pasta", "rice", "cereal", "oats", "grains"],
    Pantry: ["canned", "jarred", "pantry", "baking", "oil", "vinegar", "beans", "nuts", "seeds"],
    Spices: ["spice", "spices", "seasoning", "seasonings", "herbs"],
    Bakery: ["bakery", "bread", "tortillas"],
    Frozen: ["frozen"],
    Beverages: ["beverage", "beverages", "drink", "drinks", "juice", "tea", "coffee"],
  };
  for(const [category, values] of Object.entries(ingredientCategoryMap)){
    if(values.some((value)=> normalizedAisle.includes(value))){
      return category
    }
  }
  return "Other"
};
export const extractIngredients = (apiIngredients) => {
  const ingredients = Array.isArray(apiIngredients) ? apiIngredients : [];
  return ingredients.map((ingredient) => {
    if (ingredient == null || typeof ingredient !== "object") {
      return {
        aisle: "",
        category: "",
        name: "",
        description: "",
        quantity: { amount: 0, unit: "" },
      };
    }
    return {
      aisle: ingredient.aisle ?? "",
      category: getIngredientCategory(ingredient.aisle ?? ""),
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
