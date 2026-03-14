const rawApiKey = import.meta.env.VITE_SPOONACULAR_API_KEY;
const API_KEY= typeof rawApiKey === "string" ? rawApiKey.trim() : "";
import buildMealQueryParams from "./buildMealQueryParams";

import { transFormMeal } from "../utils/transformMeal";
const defaultProfile = { dietary: [], allergies: [] };

export default async function fetchMeals(profileData) {
    const profile = profileData ?? defaultProfile;

    if (!API_KEY) {
        throw new Error("Check API key or add in .env / .env.local");
    }
    // const params= new URLPattern({
    //     apiKey:API_KEY,
    //     addRecipeNutrition: "true",
    //     addRecipeInformation:"true",
    //     maxServings: "2",
    //     addRecipeInstructions: "true",
    //     type: "breakfast,main course,side dish",
    //     fillIngredients: "true",
    // })
    // const url =`https://api.spoonacular.com/recipes/complexSearch?${params.toString()}`;
    console.log("Incoming Profile:", profileData);

    const params = buildMealQueryParams(profileData);
  
    console.log("Generated Params:", params);
  
    const queryString = new URLSearchParams(params).toString();
  
    console.log("Query String:", queryString);
    const url =`https://api.spoonacular.com/recipes/complexSearch?${queryString}&apiKey=${API_KEY}`;
    console.log("Final API URL:", url);

    const response = await fetch(url);
    // const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&addRecipeNutrition=true&addRecipeInformation=true&addRecipeInstructions=true&type=breakfast,lunch,dinner&fillIngredients=true&number=10&diet=gluten free,vegetarian`);
    let data = null;
    try {
    data = await response.json();    
    } catch (error) {
        console.warn("Response was not jSON ",error)
    }
    if (!response.ok) {
        throw new Error(data?.message || `Spoonacular API error: ${response.status} ${response.statusText}`)
    }
    const results = Array.isArray(data?.results) ? data?.results : []
    return results.map(transFormMeal);
}