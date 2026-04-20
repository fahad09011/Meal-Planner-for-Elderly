const DAYS = [
"Monday",
"Tuesday",
"Wednesday",
"Thursday",
"Friday",
"Saturday",
"Sunday"];

const createEmptyWeeklyPlan = () => ({
  Monday: { breakfast: null, lunch: null, dinner: null },
  Tuesday: { breakfast: null, lunch: null, dinner: null },
  Wednesday: { breakfast: null, lunch: null, dinner: null },
  Thursday: { breakfast: null, lunch: null, dinner: null },
  Friday: { breakfast: null, lunch: null, dinner: null },
  Saturday: { breakfast: null, lunch: null, dinner: null },
  Sunday: { breakfast: null, lunch: null, dinner: null }
});

export const generateAutoWeeklyPlan = (meals) => {
  const weeklyPlan = createEmptyWeeklyPlan();
  const breakfastMeals = [];
  const lunchMeals = [];
  const dinnerMeals = [];
  const safeMeals = Array.isArray(meals) ? meals : [];
  safeMeals.forEach((meal) => {
    if (meal.mealType === "breakfast") {
      breakfastMeals.push(meal);
    } else if (meal.mealType === "lunch") {
      lunchMeals.push(meal);
    } else if (meal.mealType === "dinner") {
      dinnerMeals.push(meal);
    }
  });
  console.log("Breakfast count:", breakfastMeals.length);
  console.log("Lunch count:", lunchMeals.length);
  console.log("Dinner count:", dinnerMeals.length);

  DAYS.forEach((day, index) => {
    weeklyPlan[day].breakfast = breakfastMeals.length > 0 ?
    breakfastMeals[index % breakfastMeals.length] : null;

    weeklyPlan[day].lunch = lunchMeals.length > 0 ?
    lunchMeals[index % lunchMeals.length] : null;

    weeklyPlan[day].dinner = dinnerMeals.length > 0 ?
    dinnerMeals[index % dinnerMeals.length] : null;
  });
  return weeklyPlan;
};