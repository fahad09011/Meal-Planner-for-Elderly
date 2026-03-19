import React, { useState, useEffect } from "react";
import MealSection from "./MealSection";

const CATEGORIES = [
  { key: "breakfast", label: "Breakfast" },
  { key: "lunch",     label: "Lunch"     },
  { key: "dinner",    label: "Dinner"    },
];

function MealList({ meals, mealsCount, selectMeal, weeklyPlan, selectedDay, daySelection }) {
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia("(max-width: 599px)").matches
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 599px)");
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const grouped = CATEGORIES.reduce((acc, { key }) => {
    acc[key] = meals.filter((m) => m.mealType === key);
    return acc;
  }, {});

  return (
    <div className="meal-list-container">
      {CATEGORIES.map(({ key, label }) => (
        <MealSection
          key={key}
          categoryKey={key}
          label={label}
          categoryMeals={grouped[key]}
          count={mealsCount?.[key] ?? grouped[key].length}
          isMobile={isMobile}
          isSelected={daySelection?.[selectedDay]?.[key] != null}
          selectMeal={selectMeal}
          weeklyPlan={weeklyPlan}
          selectedDay={selectedDay}
          daySelection={daySelection}
        />
      ))}
    </div>
  );
}

export default MealList;