import healthConditionRules from "./healthConditionRules";

import { dietCompatibilityMap } from "./dietMap";
import { getMaxCaloriesPerMeal, getMinCaloriesPerMeal } from "../../utils/bmr";
const filterByDietary = (meal, profile) => {
  
  if (!profile.dietary || profile.dietary.length === 0) {
    return true;
  }
  const mealDiet = Array.isArray(meal.diets) ? meal.diets : [];
  return profile.dietary.every((selectedDiet)=>{
    const allowedDiets = dietCompatibilityMap[selectedDiet] || [selectedDiet];
    return allowedDiets.some((allowedDiet)=>mealDiet.includes(allowedDiet));
  })

};

const parseNutritionRuleKey = (ruleKey) => {
  let ruleType = "";
  let nutrientKey = "";
  if (ruleKey.startsWith("max")) {
    ruleType = "max";
    nutrientKey = ruleKey.slice(3);
  } else if (ruleKey.startsWith("min")) {
    ruleType = "min";
    nutrientKey = ruleKey.slice(3);
  }

  nutrientKey = nutrientKey.charAt(0).toLowerCase() + nutrientKey.slice(1);

  return { ruleType, nutrientKey };
};
const filterByHealthCondition = (meal, profile) => {
  const healthConditions = profile.healthConditions || [];

  if (healthConditions.length > 0) {
    for (const healthCondition of healthConditions) {
      if (healthConditionRules[healthCondition]) {
        for (const [key, value] of Object.entries(
          healthConditionRules[healthCondition],
        )) {
          if (key === "maxCalories") continue;
          const { ruleType, nutrientKey } = parseNutritionRuleKey(key);
          const nutrientAmount = meal.nutrition?.[nutrientKey] ?? 0;
          const hasValue = Number.isFinite(nutrientAmount);
          if (!hasValue) continue;
          if (ruleType === "min" && nutrientAmount === 0) continue;
          if (ruleType === "max" && nutrientAmount > value) return false;
          if (ruleType === "min" && nutrientAmount < value) return false;
        }

        
        
      }
    }
  }
  return true;
};

const budgetRule={
  low: 4,
  medium: 8,
flexible: true
}
const filterByBudget = (meal, profile) => {
  if (!profile.budget) {
    return true;
  }

  const pricePerServing = Number(meal.pricePerServing);
  const priceValid = Number.isFinite(pricePerServing) && pricePerServing >= 0;

  if (!priceValid) {
    return true;
  }

  const { low, medium } = budgetRule;
  if (profile.budget === "low" && pricePerServing <= low) return true;
  if (profile.budget === "medium" && pricePerServing <= medium) return true;
  if (profile.budget === "flexible") return true;
  return false;
};

const mealFitsCalorieLimit = (meal, profile) => {
  const maxCalories = getMaxCaloriesPerMeal(profile);
  const minCalories = getMinCaloriesPerMeal(profile);
  if (maxCalories == null) return true;
  const mealCalories = meal.nutrition?.calories;
  if (!Number.isFinite(mealCalories) || mealCalories <= 0) return false;
  if (mealCalories > maxCalories) return false;
  if (minCalories != null && mealCalories < minCalories) return false;
  return true;
};

export const mealCountByCategory = (filterMeal) => {
  const breakFast = filterMeal.filter((meal) => {
    return meal.mealType === "breakfast";
  }).length;
  const lunch = filterMeal.filter((meal) => {
    return meal.mealType === "lunch";
  }).length;
  const dinner = filterMeal.filter((meal) => {
    return meal.mealType === "dinner";
  }).length;
  return {
    breakfast: breakFast,
    lunch: lunch,
    dinner: dinner,
  };
};

const filterMeals = (meals, profile) => {
  let filteredMeal = meals.filter((meal) => {
    return (
      filterByDietary(meal, profile) &&
      
      filterByHealthCondition(meal, profile) &&
      mealFitsCalorieLimit(meal, profile) &&
      filterByBudget(meal, profile)
    );
  });
  
  
  return filteredMeal;
};
export default filterMeals;
