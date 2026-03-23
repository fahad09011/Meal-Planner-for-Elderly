import React from "react";
import { useNavigate } from "react-router-dom";
import mealImg from "../../assets/images/cereal.jpg";

const SLOTS = [
  { key:"breakfast", label:"Breakfast", bg:"#E6F1FB", color:"#185FA5" },
  { key:"lunch",     label:"Lunch",     bg:"#EAF3DE", color:"#3B6D11" },
  { key:"dinner",    label:"Dinner",    bg:"#FAECE7", color:"#993C1D" },
];

// ── Mock data — swap these with real meal fields when API is ready ──
const MOCK_NUTRIENTS = {
  calories: "0",
  protein:  "0",
  carbs:    "0",
  fat:      "0",
};

function DayPlanCard({ day, dayPlan }) {
  const navigate = useNavigate();

  if (!dayPlan || Object.keys(dayPlan).length === 0) {
    return (
      <div className="dayPlanEmpty">
        <p className="dayPlanEmpty__title">No meals planned for {day}</p>
        <p className="dayPlanEmpty__sub">
          Go to Meal Plan to add meals for this day.
        </p>
      </div>
    );
  }

  const doneMeals = SLOTS.filter((s) => dayPlan[s.key]).length;

  return (
    <div className="dayPlanCard">

      {/* ── Card header ── */}
      <div className="dayPlanCard__header">
        <div>
          <h3 className="dayPlanCard__title">{day}</h3>
          <p className="dayPlanCard__sub">{doneMeals} of 3 meals planned</p>
        </div>
        {doneMeals === 3 && (
          <span className="dayPlanCard__badge">All meals planned</span>
        )}
      </div>

      {/* ── Meal rows — all visible, no expand ── */}
      <div className="dayPlanCard__meals">
        {SLOTS.map(({ key, label, bg, color }) => {
          const meal = dayPlan[key];

          return (
            <div
              key={key}
              className={`mealRow ${!meal ? "mealRow--empty" : ""}`}
            >
              {/* Category colour column */}
              <div className="mealRow__cat" style={{ background: bg }}>
                <span className="mealRow__catLabel" style={{ color }}>
                  {label}
                </span>
              </div>

              {/* Image */}
              <div className="mealRow__imgWrap">
                <img
                  src={meal?.image || mealImg}
                  alt={meal?.name || label}
                  className="mealRow__img"
                />
              </div>

              {/* Info — always visible */}
              <div className="mealRow__info">

                {/* Meal name */}
                <p className="mealRow__name">
                  {meal
                    ? meal.name                          // real name from API
                    : `No ${label.toLowerCase()} selected`}
                </p>

                {meal && (
                  <>
                    {/* Nutrition strip — uses real values, falls back to mock */}
                    <div className="mealRow__nutr">
                      {[
                        {
                          label: "Calories",
                          // real field first, mock fallback second
                          val: (Math.round(meal.nutrition.calories) ?? MOCK_NUTRIENTS.calories) + " kcal",
                        },
                        {
                          label: "Protein",
                          val: (Math.round(meal.nutrition.protein) ?? MOCK_NUTRIENTS.protein) + " g",
                        },
                        {
                          label: "Carbs",
                          val: (Math.round(meal.nutrition.carbs)
                            ?? MOCK_NUTRIENTS.carbs) + " g",
                        },
                        {
                          label: "Fat",
                          val: (Math.round(meal.nutrition.fat)      ?? MOCK_NUTRIENTS.fat) + "g",
                        },
                      ].map(({ label, val }) => (
                        <div key={label} className="mealRow__nutrItem">
                          <span className="mealRow__nutrVal">{val}</span>
                          <span className="mealRow__nutrLabel">{label}</span>
                        </div>
                      ))}
                    </div>

                    {/* Diet tags */}
                    {meal.diet?.length > 0 && (
                      <div className="mealRow__tags">
                        {meal.diet.map((tag, i) => (
                          <span key={i} className="mealRow__tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* View recipe button */}
              {meal && (
                <button
                  className="mealRow__viewBtn"
                  onClick={() => navigate(`/mealDetails/${meal.id}`)}
                  aria-label={`View recipe for ${meal.name}`}
                >
                  View recipe
                  <svg
                    width="14" height="14" viewBox="0 0 14 14"
                    fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="5,3 9,7 5,11" />
                  </svg>
                </button>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
}

export default DayPlanCard;