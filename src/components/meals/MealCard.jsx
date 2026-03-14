import React, { useState } from "react";
import cerealImage from "../../assets/images/cereal.jpg";
import Button from "../common/Button";
import "../../assets/styles/mealCard.css";
function MealCard({ meals, selectMeal, daySelection }) {
  let capitalizer = (string) => {
    return string ? string[0].toUpperCase() + string.slice(1) : "";
  };
  const isSelect =
    daySelection[meals.mealType] &&
    daySelection[meals.mealType].id === meals.id;
  return (
    <>
      <main className="mainMealCardContainer ">
        <section className="mealImgAndButtonSection">
          <img
            src={meals.img}
            alt="mealimage"
            className="mealImage card-img-top"
          />
          <div className="mealButtoncontainer">
            <Button
              className={` mealButton ${isSelect ? "click" : ""}`}
              onClick={() => selectMeal(meals)}
            >
              {isSelect ? "Selected" : "Select"}
            </Button>
          </div>
        </section>

        <section className="mealDataSection">
          <div className="mealNameContainer">
            <p className="mealName">{meals.title}</p>
          </div>
          <div className="mealdescriptionContainer">
            {/* <p className="mealDescription">{meals.description}</p> */}
            <p className="mealDescription">Ise bad me dekhain gain</p>
          </div>
          <div className="mealTagContainer">
            {meals.diet.map((meal, index) => (
              <p key={index}>{capitalizer(meal)}</p>
            ))}
            
          </div>
        </section>
      </main>
    </>
  );
}

export default MealCard;
