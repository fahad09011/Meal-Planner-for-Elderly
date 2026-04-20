import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../common/Button";
import "../../assets/styles/mealCard.css";

function MealCard({ meals, selectMeal, daySelection }) {
  const navigate = useNavigate();
  const capitalizer = (string) =>
  string ? string[0].toUpperCase() + string.slice(1) : "";

  const isSelected = daySelection?.[meals.mealType]?.id === meals.id;
  const summaryTeaser =
  typeof meals.summary === "string" && meals.summary.trim() !== "" ?
  meals.summary.trim() :
  null;

  return (
    <div className="mainMealCardContainer">

      <img
        src={meals.image}
        alt={meals.title}
        className="mealImage" />
      

      <div className="mealDataSection">
        <p className="mealName">{meals.title}</p>
        {summaryTeaser ?
        <p className="mealDescription mealDescription--teaser">{summaryTeaser}</p> :
        null}
        <div className="mealTagContainer">
          {(meals.diets ?? []).map((tag, index) =>
          <span key={index} className="mealTag">
              {capitalizer(tag)}
            </span>
          )}
        </div>
      </div>

      <div className="mealCardActions">

        <Button
          className={`mealButton ${isSelected ? "click" : "button"}`}
          onClick={() => selectMeal(meals)}>
          
          {isSelected ? "✓ Selected" : "Select for plan"}
        </Button>

        <button
          type="button"
          className="mealViewBtn"
          onClick={() =>
          navigate(`/mealDetails/${meals.id}`, { state: { meal: meals } })
          }>
          
          <svg
            width="14" height="14" viewBox="0 0 14 14"
            fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round"
            strokeLinejoin="round">
            
            <path d="M1 7s2-4 6-4 6 4 6 4-2 4-6 4-6-4-6-4z" />
            <circle cx="7" cy="7" r="1.8" />
          </svg>
          View recipe
        </button>

      </div>

    </div>);

}

export default MealCard;