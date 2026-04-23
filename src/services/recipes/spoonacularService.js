import buildMealQueryParams from "./buildMealQueryParams";
import { transFormMeal } from "../../utils/transformMeal";

export default async function fetchMeals(profileData) {
  const params = buildMealQueryParams(profileData);
  const queryString = new URLSearchParams(params).toString();
  const url = `/api/meals?${queryString}`;

  if (import.meta.env.DEV) {
    console.log("[Spoonacular proxy] GET", url);
  }

  const response = await fetch(url);
  let data = null;
  try {
    data = await response.json();
  } catch (error) {
    console.warn("Response was not JSON", error);
  }

  if (!response.ok) {
    throw new Error(data?.error || data?.message || `Spoonacular API error: ${response.status} ${response.statusText}`);
  }

  const results = Array.isArray(data?.results) ? data.results : [];
  return results.map(transFormMeal);
}
