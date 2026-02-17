import React, { useContext } from "react";
import { ProfileContext } from "../context/ProfileContext";
import filterMeals from "../services/nutritionService";
import meals from "../data/meals.json";


export default function useNutrition(){
 const { profileData } =
    useContext(ProfileContext);

    const filteredMeals = filterMeals(meals, profileData);

    console.log("from usenutrition", filteredMeals)

    return filteredMeals;
}
