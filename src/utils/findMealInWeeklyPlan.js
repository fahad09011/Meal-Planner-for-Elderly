const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const MEAL_TYPES = ["breakfast", "lunch", "dinner"];

/**
 * Finds a meal in context weeklyPlan by Spoonacular id (string or number).
 */
export function findMealInWeeklyPlan(weeklyPlan, mealId) {
  if (weeklyPlan == null || mealId == null || mealId === "") {
    return null;
  }
  const mealIdString = String(mealId);

  for (const dayName of DAYS) {
    const dayPlan = weeklyPlan[dayName];
    if (!dayPlan || typeof dayPlan !== "object") continue;

    for (const mealSlot of MEAL_TYPES) {
      const mealAtSlot = dayPlan[mealSlot];
      if (mealAtSlot && String(mealAtSlot.id) === mealIdString) {
        return mealAtSlot;
      }
    }
  }

  return null;
}
