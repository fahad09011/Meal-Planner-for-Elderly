import buildMealQueryParams from "./buildMealQueryParams";
import { transFormMeal } from "../../utils/transformMeal";

export default async function fetchMeals(profileData) {
  const params = buildMealQueryParams(profileData);

  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    search.set(key, String(value));
  }

  const clientKey = import.meta.env.VITE_SPOONACULAR_API_KEY;
  const hasClientKey = typeof clientKey === "string" && clientKey.trim() !== "";
  const query = search.toString();

  let requestUrl;
  if (hasClientKey) {
    const url = new URL("https://api.spoonacular.com/recipes/complexSearch");
    url.search = query;
    url.searchParams.set("apiKey", clientKey.trim());
    requestUrl = url.toString();
  } else {
    if (import.meta.env.DEV) {
      throw new Error(
        "Set VITE_SPOONACULAR_API_KEY in .env.local for local dev, or get a key at https://spoonacular.com/food-api",
      );
    }
    const pathPrefix = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
    requestUrl = `${pathPrefix}/api/meals?${query}`;
  }

  const response = await fetch(requestUrl);
  const raw = await response.text();
  let data;
  const trimmed = raw.trimStart();
  if (trimmed.startsWith("<!") || trimmed.toLowerCase().startsWith("<html")) {
    throw new Error(
      "Meal search failed: the server returned a web page instead of recipe data. " +
        "This usually means /api is blocked by a bad rewrite, or the deploy is out of date. " +
        "In Vercel, set SPOONACULAR_API_KEY and redeploy with the current vercel.json.",
    );
  }
  try {
    data = raw ? JSON.parse(raw) : null;
  } catch {
    throw new Error(
      "Meal search returned invalid data. Check /api/meals on the server and redeploy.",
    );
  }

  if (!response.ok) {
    const fromApi =
      data &&
      (typeof data.message === "string"
        ? data.message
        : typeof data.error === "string"
          ? data.error
          : null);
    if (response.status === 404 && !hasClientKey) {
      throw new Error(
        "Recipe search endpoint not found. For local `vite preview`, set VITE_SPOONACULAR_API_KEY, or use `vercel dev` / a real Vercel deploy with SPOONACULAR_API_KEY set.",
      );
    }
    throw new Error(
      fromApi || `Recipe search failed: ${response.status} ${response.statusText}`,
    );
  }

  if (!data) {
    throw new Error("Meal search returned an empty response.");
  }
  const results = Array.isArray(data?.results) ? data.results : [];
  return results.map(transFormMeal);
}
