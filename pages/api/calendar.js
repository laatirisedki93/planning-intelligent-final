// pages/api/calendar.js
export default async function handler(req, res) {
  const year = new Date().getFullYear();

  try {
    const response = await fetch(`https://data.education.gouv.fr/api/records/1.0/search/?dataset=fr-en-calendrier-scolaire&q=&rows=1000&refine.annee_scolaire=${year}-${year + 1}&refine.zone=Zone+C`);
    const data = await response.json();

    const vacances = data.records.map((r) => ({
      start: r.fields.start_date,
      end: r.fields.end_date,
      description: r.fields.description,
    }));

    res.status(200).json({ vacances });
  } catch (err) {
    console.error("❌ Erreur vacances scolaires :", err);
    res.status(500).json({ error: "Erreur vacances scolaires" });
  }
}
