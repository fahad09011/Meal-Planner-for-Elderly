import React from "react";
import Button from "../common/Button";
import "../../assets/styles/mealCard.css";

function MealCard({ meals, selectMeal, daySelection }) {
  const capitalizer = (string) =>
    string ? string[0].toUpperCase() + string.slice(1) : "";

  const isSelected =
    daySelection?.[meals.mealType]?.id === meals.id;

  return (
    <div className="mainMealCardContainer">

      {/* ── Image ── */}
      <img
        src={meals.image}
        alt={meals.title}
        className="mealImage"
      />

      {/* ── Select button ── */}
      <div className="mealButtoncontainer">
        <Button
          className={`mealButton ${isSelected ? "click" : "button"}`}
          onClick={() => selectMeal(meals)}
        >
          {isSelected ? "✓ Selected" : "Select"}
        </Button>
      </div>

      {/* ── Text data ── */}
      <div className="mealDataSection">
        <p className="mealName">{meals.title}</p>
        <p className="mealDescription">Ise bad me dekhain gain</p>
        <div className="mealTagContainer">
          {meals.diet.map((tag, index) => (
            <span key={index} className="mealTag">
              {capitalizer(tag)}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
}

export default MealCard;