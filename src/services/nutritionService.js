import healthConditionRules from "./nutrition/healthConditionRules";
// meal filter consts section ===============================
const filterByDietary = (meal, profile) => {
  console.log("filterByDietary called");
  console.log("meal.diet:", meal.diet);
  console.log("profile.dietary:", profile.dietary);
  if (!profile.dietary || profile.dietary.length === 0) {
    console.log("No dietary preferences, returning true");

    return true;
  }
const result = profile.dietary.every((dt) => meal.diet.includes(dt));
console.log("filterByDietary result:", result);

  return result
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
          const mealNutrient = meal.nutrition?.[nutrientKey];
          const nutrientAmount = mealNutrient?.amount ?? 0;
          // console.log(
          //   "key: ",key,", RuleType ",ruleType,", Nutrient Key: ",nutrientKey,", value: ",value,
          // );
          // console.log("Meal nutrients:", nutrientKey, nutrientAmount);
          if (ruleType === "max" && nutrientAmount > value) {
            return false;
          }
          if (ruleType === "min" && nutrientAmount < value) {
            return false;
          }
        }

        // console.log("healthCondition",healthCondition,healthConditionRules[healthCondition],
        // );
      }
    }
  }
  return true;
};

const filterByBudget = (meal, profile) => {
  if (!profile.budget) {
    return true;
  }
  return meal.budget === profile.budget;
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
