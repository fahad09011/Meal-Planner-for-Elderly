export default async function handler(req, res) {
  const rawApiKey = process.env.SPOONACULAR_API_KEY.trim();
  const API_KEY = typeof rawApiKey === "string" ? rawApiKey.trim() : "";
  if (!API_KEY) {
    return res.
    status(500).
    json({ error: "spoonacular-API_KEY is not set on server" });
  }
  const { type = "breakfast,main course,side dish" } = req.query || {};
  const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&addRecipeNutrition=true&addRecipeInformation=true&addRecipeInstructions=true&${encodeURIComponent(type)}&fillIngredients=true`;

  try {
    const response = await fetch(url);

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data?.message });
    }
    return res.status(200).json(data);
  } catch (error) {
    console.error("Serverless Spoonacular error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}