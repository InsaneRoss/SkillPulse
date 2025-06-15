export default async function handler(req, res) {
  const { username } = req.query;
  const url = `https://secure.runescape.com/m=hiscore/index_lite.ws?player=${encodeURIComponent(username)}`;

  try {
    const response = await fetch(url);
    const text = await response.text();
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).send(text);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hiscores" });
  }
}
