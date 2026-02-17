// import meals from "../data/meals.json";
// import userProfile from "../data/users.json";

// let allergen = ["gluten"];
function checkDietary(meals, profile) {
  if (!profile.dietary || profile.dietary.length === 0) {
    return true;
  }
  return profile.dietary.every((dt) => meals.dietary.includes(dt));
}

function checkAllergens(meals, profile) {
  if (!profile.allergies || profile.allergies.length === 0) {
    return true;
  }
  return !profile.allergies.some((alg) => meals.allergens.includes(alg));
}


function checkHealthCondition(meals, profile) {
if (!profile.healthConditions || profile.healthConditions.length === 0) {
    return true;
}
if(profile.healthConditions.includes("bloodPressure") && meals.sodiumLevel === "high"){
    return false;
}
if(profile.healthConditions.includes("diabetes") && meals.sugarLevel === "high"){
    return false;
}
return true;
}


function checkBudget(meals, profile) {
if (!profile.budget) {
    return true;
}

return meals.budget === profile.budget ;
}

export default function filterMeals(meals, profile) {
  let filteredMeal = meals.filter((meal) => {
    return (
        checkDietary(meal, profile) &&
        checkAllergens(meal, profile) &&
        checkHealthCondition(meal, profile) 
        &&
        checkBudget(meal, profile)
    );
  });
  console.log("from services", filteredMeal);
  return filteredMeal;
}
