import React, { useContext } from "react";
import filterMeals, { mealCountByCategory } from "../services/nutritionService";
import meals from "../data/meals.json";
import { AppContext } from "../context/AppContext";
export default function useNutrition() {
  const { profileData, setProfileData } = useContext(AppContext);
  const filteredMeals = filterMeals(meals, profileData);
  const count = mealCountByCategory(filteredMeals);
  return { filteredMeals, count};
}
