export default async function handler(req, res) {
  const { username } = req.query;
  const url = `https://runepixels.com/players/${encodeURIComponent(username)}/skills`;

  try {
    const html = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" }
    }).then(r => r.text());

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).send(html);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch RunePixels data" });
  }
}
