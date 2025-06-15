import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { username } = req.query;
  const url = `https://runepixels.com/users/${encodeURIComponent(username)}`;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });
    const html = await response.text();
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).send(html);
  } catch (error) {
    console.error("RunePixels fetch failed:", error);
    res.status(500).json({ error: "Failed to fetch RunePixels page" });
  }
}
