import React, { useState, useEffect } from "react";
import MealSection from "./MealSection";

const CATEGORIES = [
{ key: "breakfast", label: "Breakfast" },
{ key: "lunch", label: "Lunch" },
{ key: "dinner", label: "Dinner" }];


function MealList({ meals, mealsCount, selectMeal, weeklyPlan, selectedDay, daySelection }) {
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia("(max-width: 599px)").matches
  );

  useEffect(() => {
    const narrowScreenQuery = window.matchMedia("(max-width: 599px)");
    const onViewportChange = (event) => setIsMobile(event.matches);
    narrowScreenQuery.addEventListener("change", onViewportChange);
    return () =>
    narrowScreenQuery.removeEventListener("change", onViewportChange);
  }, []);

  const mealsByMealType = CATEGORIES.reduce((accumulator, { key }) => {
    accumulator[key] = meals.filter((meal) => meal.mealType === key);
    return accumulator;
  }, {});

  return (
    <div className="meal-list-container">
      {CATEGORIES.map(({ key, label }) =>
        <MealSection
          key={key}
          label={label}
        categoryMeals={mealsByMealType[key]}
        count={mealsCount?.[key] ?? mealsByMealType[key].length}
        isMobile={isMobile}
        isSelected={daySelection?.[selectedDay]?.[key] != null}
        selectMeal={selectMeal}
        weeklyPlan={weeklyPlan}
        selectedDay={selectedDay}
        daySelection={daySelection} />

      )}
    </div>);

}

export default MealList;