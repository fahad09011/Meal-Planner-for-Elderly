import React, { useState } from "react";
import cerealImage from "../../assets/images/cereal.jpg";
import Button from "../common/Button";
import "../../assets/styles/mealCard.css";
function MealCard({ meals,selectedDay,weeklyPlan,selectMeal,daySelection,
  /* // random tags are optional discuss with supervisor */
  getRandonMealTag }) {
  let capitalizer = (string) => {
    return string ? string[0].toUpperCase() + string.slice(1) : "";
  };
  // random tags are optional discuss with supervisor
  // const tag = getRandonMealTag(meals);

// const selectedCategory = selectedMeal[meals.category]
const isSelect = daySelection[meals.category] && daySelection[meals.category].id === meals.id;
  return (
    <>
      <main className="mainMealCardContainer ">
        <section className="mealImgAndButtonSection">
          <img src={cerealImage} alt="mealimage" className="mealImage card-img-top" />
          <div className="mealButtoncontainer">

          <Button className={` mealButton ${isSelect ? "click" : ""}`} onClick={()=>(selectMeal(meals))}>{isSelect ? "Selected" : "Select"}</Button>
          </div>
        </section>

        <section className="mealDataSection">
            <div className="mealNameContainer">
          <p className="mealName">{meals.name}</p>

            </div>
            <div className="mealdescriptionContainer">
          <p className="mealDescription">{meals.description}</p>

            </div>
    <div className="mealTagContainer">
         {meals.dietary.map((meal, index) => (
            <p key={index}>{capitalizer(meal)}</p>
          ))}
        <p>
            {`${capitalizer(meals.sodiumLevel)} Sodium`}
        </p>
        

         {/* <p> {`${capitalizer(meals.budget)} Budget`}</p> */}
    </div>
         
        </section>
      </main>
    </>
  );
}

export default MealCard;
