// pages/api/weather.js
export default async function handler(req, res) {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: "Latitude ou longitude manquante" });
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_KEY}&units=metric&lang=fr`
    );
    const data = await response.json();

    if (!data || data.cod !== 200) {
      throw new Error(data.message || "Erreur OpenWeather");
    }

    res.status(200).json({ weather: data });
  } catch (err) {
    console.error("❌ Erreur météo :", err);
    res.status(500).json({ error: "Erreur météo" });
  }
}
