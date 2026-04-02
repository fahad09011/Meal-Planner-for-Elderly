import healthConditionRules from "./healthConditionRules";

import { dietCompatibilityMap } from "./dietMap";
const filterByDietary = (meal, profile) => {
  
  if (!profile.dietary || profile.dietary.length === 0) {
    console.log("No dietary preferences, returning true");

    return true;
  }
  const mealDiet = Array.isArray(meal.diets) ? meal.diets : [];
  return profile.dietary.every((selectedDiet)=>{
    const allowedDiets = dietCompatibilityMap[selectedDiet] || [selectedDiet];
    return allowedDiets.some((allowedDiet)=>mealDiet.includes(allowedDiet));
  })
// const result = profile.dietary.every((dt) => meal.diet.includes(dt));
// console.log("filterByDietary result:", result);

//   return result
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
          const { ruleType, nutrientKey } = parseNutritionRuleKey(key);
          const nutrientAmount = meal.nutrition?.[nutrientKey] ?? 0;
          const hasValue = Number.isFinite(nutrientAmount);
          if (!hasValue) continue;
          if (ruleType === "min" && nutrientAmount === 0) continue;
          if (ruleType === "max" && nutrientAmount > value) return false;
          if (ruleType === "min" && nutrientAmount < value) return false;
        }

        // console.log("healthCondition",healthCondition,healthConditionRules[healthCondition],
        // );
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

// meal type dinner , lunch , dinner count consts section ====================
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
      // filterByAllergens(meal, profile) &&
      filterByHealthCondition(meal, profile) &&
      filterByBudget(meal, profile)
    );
  });
  // console.log("from services", filteredMeal);
  // console.log("Total filtered meals: ", filteredMeal.length);
  return filteredMeal;
};
export default filterMeals;
