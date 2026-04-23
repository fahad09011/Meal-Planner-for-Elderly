/**
 * Server-only Spoonacular proxy. Keeps SPOONACULAR_API_KEY off the client bundle
 * and out of the browser network tab (requests go to this route; key is added here).
 * Set SPOONACULAR_API_KEY in Vercel project env (not VITE_).
 */
export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const raw = process.env.SPOONACULAR_API_KEY;
  const API_KEY = typeof raw === "string" ? raw.trim() : "";
  if (!API_KEY) {
    return res.
      status(500).
      json({ error: "SPOONACULAR_API_KEY is not set for the server" });
  }

  const search = new URLSearchParams();
  const q = req.query || {};
  for (const [key, value] of Object.entries(q)) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      value.forEach((v) => search.append(key, String(v)));
    } else {
      search.set(key, String(value));
    }
  }

  const upstream = `https://api.spoonacular.com/recipes/complexSearch?${search.toString()}&apiKey=${encodeURIComponent(API_KEY)}`;

  try {
    const response = await fetch(upstream);
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return res.
        status(response.status).
        json({ error: data?.message || "Spoonacular request failed" });
    }
    return res.status(200).json(data);
  } catch (e) {
    console.error("api/spoonacular proxy error:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
}
