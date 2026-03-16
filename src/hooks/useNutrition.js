import React, { useContext } from "react";
import filterMeals, { mealCountByCategory } from "../services/nutritionService";
import { AppContext } from "../context/AppContext";
 const  useNutrition = (meals) => {
  const safeMeals = Array.isArray(meals) ? meals : [] ;

  const { profileData, setProfileData } = useContext(AppContext);

  const filteredMeals = filterMeals(safeMeals, profileData);

  const count = mealCountByCategory(filteredMeals);
  
  return { filteredMeals, count};
}


export default useNutrition;
