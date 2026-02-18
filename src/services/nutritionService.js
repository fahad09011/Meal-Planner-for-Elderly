
// meal filter functions section ===============================
function filterByDietary(meal, profile) {
  if (!profile.dietary || profile.dietary.length === 0) {
    return true;
  }
  return profile.dietary.every((dt) => meal.dietary.includes(dt));
}

function filterByAllergens(meal, profile) {
  if (!profile.allergies || profile.allergies.length === 0) {
    return true;
  }
  return !profile.allergies.some((alg) => meal.allergens.includes(alg));
}

function filterByHealthCondition(meal, profile) {
if (!profile.healthConditions || profile.healthConditions.length === 0) {
    return true;
}
if(profile.healthConditions.includes("bloodPressure") && meal.sodiumLevel === "high"){
    return false;
}
if(profile.healthConditions.includes("diabetes") && meal.sugarLevel === "high"){
    return false;
}
return true;
}


function filterByBudget(meal, profile) {
if (!profile.budget) {
    return true;
}
return meal.budget === profile.budget ;
}

// meal type dinner , lunch , dinner count functions section ====================
export function mealCountByCategory(filterMeal) {
  const breakFast = filterMeal.filter((meal) => {
    return meal.category === "breakfast";
  }).length;
  const lunch = filterMeal.filter((meal) => {
    return meal.category === "lunch";
  }).length;
  const dinner = filterMeal.filter((meal) => {
    return meal.category === "dinner";
  }).length;
  return ({
    breakfast: breakFast,
    lunch: lunch,
    dinner: dinner,
  })
}

export default function filterMeals(meals, profile) {
   let filteredMeal = meals.filter((meal) => {
    return (
        filterByDietary(meal, profile) &&
        filterByAllergens(meal, profile) &&
        filterByHealthCondition(meal, profile) 
        &&
        filterByBudget(meal, profile)
      );
    });
  console.log("from services", filteredMeal);
  console.log("Total filtered meals: ", filteredMeal.length);
  return filteredMeal;
}
