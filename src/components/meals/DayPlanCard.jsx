import React, { useState } from "react";
import mealImg from "../../assets/images/cereal.jpg";

const MEAL_SLOTS = [
  { key: "breakfast", label: "Breakfast", color: "#E6F1FB", iconColor: "#185FA5" },
  { key: "lunch",     label: "Lunch",     color: "#EAF3DE", iconColor: "#3B6D11" },
  { key: "dinner",    label: "Dinner",    color: "#FAECE7", iconColor: "#993C1D" },
];

function DayPlanCard({ day, dayPlan }) {
  const [expanded, setExpanded] = useState(null);

  if (!dayPlan) {
    return (
      <div className="dayPlanEmpty">
        <p>No meals planned for {day} yet.</p>
        <p className="dayPlanEmptySub">
          Go to Meal Plan to add meals for this day.
        </p>
      </div>
    );
  }

  return (
    <div className="dayPlanCard">

      {/* ── Day header ── */}
      <div className="dayPlanCard__header">
        <div>
          <h3 className="dayPlanCard__title">{day}</h3>
          <p className="dayPlanCard__sub">
            {MEAL_SLOTS.filter((s) => dayPlan[s.key]).length} of 3 meals planned
          </p>
        </div>
        {MEAL_SLOTS.filter((s) => dayPlan[s.key]).length === 3 && (
          <span className="dayPlanCard__badge dayPlanCard__badge--full">
            All done
          </span>
        )}
      </div>

      {/* ── Meal slots ── */}
      <div className="dayPlanCard__meals">
        {MEAL_SLOTS.map(({ key, label, color }) => {
          const meal = dayPlan[key];
          const isExpanded = expanded === key;

          return (
            <div
              key={key}
              className={`mealSlot ${isExpanded ? "mealSlot--expanded" : ""} ${
                !meal ? "mealSlot--empty" : ""
              }`}
              onClick={() => meal && setExpanded(isExpanded ? null : key)}
            >
              <div className="mealSlot__row">

                {/* icon */}
                <div
                  className="mealSlot__icon"
                  style={{ background: color }}
                >
                  <span className="mealSlot__iconLabel">
                    {label.slice(0, 1)}
                  </span>
                </div>

                {/* info */}
                <div className="mealSlot__info">
                  <span className="mealSlot__cat">{label}</span>
                  <span className="mealSlot__name">
                    {meal ? meal.name : `No ${label.toLowerCase()} selected`}
                  </span>
                </div>

                {/* check */}
                {meal && (
                  <div className={`mealSlot__check ${meal ? "mealSlot__check--done" : ""}`}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                      stroke="white" strokeWidth="2.5" strokeLinecap="round"
                      strokeLinejoin="round">
                      <polyline points="1.5,6 4.5,9.5 10.5,2.5" />
                    </svg>
                  </div>
                )}
              </div>

              {/* expanded nutrition panel */}
              {isExpanded && meal && (
                <div className="mealSlot__expand">
                  <div className="mealSlot__image-wrap">
                    <img
                      src={meal.image || mealImg}
                      alt={meal.name}
                      className="mealSlot__image"
                    />
                  </div>
                  <div className="mealSlot__detail">
                    <div className="mealSlot__nutr">
                      {[
                        { label: "Calories", val: meal.calories ?? "—" },
                        { label: "Protein",  val: meal.protein  ?? "—" },
                        { label: "Carbs",    val: meal.carbs    ?? "—" },
                        { label: "Fat",      val: meal.fat      ?? "—" },
                      ].map(({ label, val }) => (
                        <div key={label} className="mealSlot__nutrItem">
                          <span className="mealSlot__nutrVal">{val}</span>
                          <span className="mealSlot__nutrLabel">{label}</span>
                        </div>
                      ))}
                    </div>
                    {meal.diet?.length > 0 && (
                      <div className="mealSlot__tags">
                        {meal.diet.map((tag, i) => (
                          <span key={i} className="mealSlot__tag">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
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