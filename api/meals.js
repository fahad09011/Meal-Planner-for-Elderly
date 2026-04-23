export default async function handler(req, res) {
  const rawApiKey = process.env.SPOONACULAR_API_KEY;
  const apiKey = typeof rawApiKey === "string" ? rawApiKey.trim() : "";

  if (!apiKey) {
    return res.status(500).json({ error: "SPOONACULAR_API_KEY is not set on server" });
  }

  const search = new URLSearchParams(req.query || {});
  search.delete("apiKey");
  search.set("apiKey", apiKey);

  const url = `https://api.spoonacular.com/recipes/complexSearch?${search.toString()}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data?.message || "Spoonacular request failed" });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Serverless Spoonacular error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
