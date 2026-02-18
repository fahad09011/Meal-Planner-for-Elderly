import React, { useContext, useState } from "react";
import { ProfileContext } from "../context/ProfileContext";
import filterMeals, { mealCountByCategory } from "../services/nutritionService";
import meals from "../data/meals.json";

export default function useNutrition() {
  const { profileData } = useContext(ProfileContext);

  const filteredMeals = filterMeals(meals, profileData);

  const count = mealCountByCategory(filteredMeals);

  //   console.log("from usenutrition", filteredMeals);

  //   console.log("count", count);

  return { filteredMeals, count };
}
