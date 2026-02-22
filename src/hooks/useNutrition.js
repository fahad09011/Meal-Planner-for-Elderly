import React, { useContext } from "react";
import { ProfileContext } from "../context/ProfileContext";
import filterMeals, { mealCountByCategory } from "../services/nutritionService";
import meals from "../data/meals.json";

export default function useNutrition() {
  const { profileData } = useContext(ProfileContext);

  const filteredMeals = filterMeals(meals, profileData);

  const count = mealCountByCategory(filteredMeals);


  // function getRandonMealTag(meal) {
  //   if(!meal.dietary || meal.dietary.length === 0){
  //     return ""
  //   }
  //   let randomIndex = Math.floor(Math.random() * meal.dietary.length);
  //   return meal.dietary[randomIndex];

  //  }

    // console.log("from usenutrition", filteredMeals);

    // console.log("count", count);
   

  return { filteredMeals, count};

  {/* // random tags are optional discuss with supervisor */}
  // return { filteredMeals, count,getRandonMealTag};
}
