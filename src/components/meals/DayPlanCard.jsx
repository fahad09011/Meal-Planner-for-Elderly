import React from "react";
import { useNavigate } from "react-router-dom";
import mealImg from "../../assets/images/cereal.jpg";

const SLOTS = [
  { key:"breakfast", label:"Breakfast", bg:"#E6F1FB", color:"#185FA5" },
  { key:"lunch",     label:"Lunch",     bg:"#EAF3DE", color:"#3B6D11" },
  { key:"dinner",    label:"Dinner",    bg:"#FAECE7", color:"#993C1D" },
];

const MOCK_NUTRIENTS = {
  calories: "0", protein: "0", carbs: "0", fat: "0",
};

function DayPlanCard({
  day,
  dayPlan,
  isMealDone,       
  toggleMealDone,   
  markDayDone,      
  isDayComplete,    
}) {
  const navigate = useNavigate();

  if (!dayPlan || Object.keys(dayPlan).length === 0) {
    return (
      <div className="day-plan-empty">
        <p className="day-plan-empty-title">No meals planned for {day}</p>
        <p className="day-plan-empty-subtitle">
          Go to Meal Plan to add meals for this day.
        </p>
      </div>
    );
  }

  const plannedCount  = SLOTS.filter((s) => dayPlan[s.key]).length;
  const allDayDone    = isDayComplete(day);

  return (
    <div className="day-plan-card">
      <div className="day-plan-card-header">
        <div>
          <h3 className="day-plan-card-title">{day}</h3>
          <p className="day-plan-card-subtitle">{plannedCount} of 3 meals planned</p>
        </div>

        <div className="day-plan-card-header-actions">
          {allDayDone ? (
            <span className="day-plan-card-status-badge day-plan-card-status-badge--done">
              ✓ All eaten today
            </span>
          ) : (
            <button
              className="mark-all-done-btn"
              onClick={() => markDayDone(day)}
            >
              Mark all done
            </button>
          )}
        </div>
      </div>
      <div className="day-plan-meal-list">
        {SLOTS.map(({ key, label, bg, color }) => {
          const meal = dayPlan[key];
          const done = isMealDone(day, key);

          return (
            <div
              key={key}
              className={`meal-row ${!meal ? "meal-row--empty" : ""} ${done ? "meal-row--done" : ""}`}
            >
              <div className="meal-row-category" style={{ background: bg }}>
                <span className="meal-row-category-label" style={{ color }}>
                  {label}
                </span>
              </div>
              <div className="meal-row-image-wrap">
                <img
                  src={meal?.image || mealImg}
                  alt={meal?.name || label}
                  className="meal-row-image"
                />
              </div>
              <div className="meal-row-content">
                <p className="meal-row-title">
                  {meal
                    ? meal.name
                    : `No ${label.toLowerCase()} selected`}
                </p>

                {meal && (
                  <>
                  <div className="mealDataContainer">
                    <p className="mealname">{meal.title}</p>
                    
                    <div className="meal-row-nutrition">
                     
                      {[
                        {
                          label: "Calories",
                          val: meal.nutrition?.calories
                            ? Math.round(meal.nutrition.calories) + " kcal"
                            : MOCK_NUTRIENTS.calories,
                        },
                        {
                          label: "Protein",
                          val: meal.nutrition?.protein
                            ? Math.round(meal.nutrition.protein) + "g"
                            : MOCK_NUTRIENTS.protein,
                        },
                        {
                          label: "Carbs",
                          val: meal.nutrition?.carbs
                            ? Math.round(meal.nutrition.carbs) + "g"
                            : MOCK_NUTRIENTS.carbs,
                        },
                        {
                          label: "Fat",
                          val: meal.nutrition?.fat
                            ? Math.round(meal.nutrition.fat) + "g"
                            : MOCK_NUTRIENTS.fat,
                        },
                      ].map(({ label, val }) => (
                        <div key={label} className="meal-row-nutrition-item">
                          <span className="meal-row-nutrition-value">{val}</span>
                          <span className="meal-row-nutrition-label">{label}</span>
                        </div>
                      ))}
                    </div>

                    {meal.diet?.length > 0 && (
                      <div className="meal-row-tags">
                        {meal.diet.map((tag, i) => (
                          <span key={i} className="meal-row-tag">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  </>
                )}
              </div>
              {meal && (
                <div className="meal-row-actions">
                  <button
                    className={`meal-done-check ${done ? "meal-done-check--done" : ""}`}
                    onClick={() => toggleMealDone(day, key)}
                    aria-label={
                      done
                        ? `Mark ${label} as not eaten`
                        : `Mark ${label} as eaten`
                    }
                    title={done ? "Mark as not eaten" : "Mark as eaten"}
                  >
                    {done && (
                      <svg width="14" height="14" viewBox="0 0 12 12"
                        fill="none" stroke="white" strokeWidth="2.5"
                        strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="1.5,6 4.5,9.5 10.5,2.5" />
                      </svg>
                    )}
                  </button>
                  <button
                    className="meal-row-view-recipe-btn"
                    onClick={() =>
                      navigate(`/mealDetails/${meal.id}`, { state: { meal } })
                    }
                    aria-label={`View recipe for ${meal.name || meal.title}`}
                  >
                    View recipe
                    <svg width="14" height="14" viewBox="0 0 14 14"
                      fill="none" stroke="currentColor"
                      strokeWidth="2" strokeLinecap="round"
                      strokeLinejoin="round">
                      <polyline points="5,3 9,7 5,11" />
                    </svg>
                  </button>

                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
}

export default DayPlanCard;