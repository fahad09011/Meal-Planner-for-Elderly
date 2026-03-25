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
    const params = buildMealQueryParams(profileData);

    const queryString = new URLSearchParams(params).toString();
    const url = `https://api.spoonacular.com/recipes/complexSearch?${queryString}&apiKey=${API_KEY}`;

    if (import.meta.env.DEV) {
      console.log("[Spoonacular] complexSearch params:", params);
    }

    const response = await fetch(url);
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