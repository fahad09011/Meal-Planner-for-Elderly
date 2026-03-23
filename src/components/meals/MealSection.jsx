import React from "react";
import MealCard from "./MealCard";
import HorizontalScroll from "./HorizontalScroll";

const GRID_COLS = "col-12 col-sm-4 col-lg-4 col-xl-3";

function MealSection({
  categoryKey, label, categoryMeals, count,
  isMobile, isSelected,
  selectMeal, weeklyPlan, selectedDay, daySelection,
}) {
  const sharedCardProps = { weeklyPlan, daySelection, selectedDay };

  return (
    <section className="meal-section mb-5">

      {/* Header */}
      <div className="d-flex align-items-center gap-2 mb-3 px-2 px-sm-0">
        <h2 className="h5 mb-0 fw-semibold">{label}</h2>

        <span className="badge rounded-pill bg-success bg-opacity-10 text-success fw-semibold">
          {count} options
        </span>

        {isSelected && (
          <span className="badge bg-success d-flex align-items-center gap-1 ms-1">
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none"
              stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1.5,6 4.5,9.5 10.5,2.5" />
            </svg>
            Selected
          </span>
        )}
      </div>

      {/* Body */}
      {categoryMeals.length === 0 ? (
        <p className="text-muted fst-italic px-2">
          No {label.toLowerCase()} options found.
        </p>

      ) : isMobile ? (
        <HorizontalScroll
          meals={categoryMeals}
          selectMeal={selectMeal}
          {...sharedCardProps}
        />

      ) : (
        <div className="row g-3">
          {categoryMeals.map((meal) => (
            <div
              className={GRID_COLS}
              key={meal.id ?? meal._id ?? meal.name}
            >
              <MealCard
                meals={meal}
                selectMeal={selectMeal}
                {...sharedCardProps}
              />
            </div>
          ))}
        </div>
      )}

    </section>
  );
}

export default MealSection;