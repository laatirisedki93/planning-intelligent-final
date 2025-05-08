// pages/api/gpt.js
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { interventions, agents } = req.body;

  if (!interventions || !Array.isArray(interventions)) {
    return res
      .status(400)
      .json({ error: "Liste des interventions manquante ou invalide" });
  }

  const prompt = `Tu es un assistant intelligent chargé d’optimiser l’ordre des interventions techniques dans une ville.
Voici les interventions à prioriser intelligemment en tenant compte de :
- L’urgence
- L’adresse (trajets)
- Les vacances scolaires (écoles, crèches)
- La météo
- Le nombre d’agents disponibles par jour (${agents})

Format de réponse attendu : liste triée avec justification rapide pour chaque ordre.

${interventions
  .map(
    (i, index) => `Intervention ${index + 1} :
- Description : ${i.description}
- Lieu : ${i.lieu}
- Urgence : ${i.urgence}
- Date souhaitée : ${i.date || "Non précisée"}`
  )
  .join("\n\n")}`;

  // Debug log pour vérifier les variables
  console.log("Clé GPT chargée :", process.env.OPENAI_API_KEY ? "✅ OK" : "❌ VIDE");
  console.log("Prompt généré :", prompt);

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }]
    });    

    const output = completion.choices[0].message.content;
    res.status(200).json({ resultat: output });
  } catch (err) {
    console.error("❌ Erreur GPT complète :", err.response?.data || err.message || err);
    res.status(500).json({ error: "Erreur GPT" });
  }
}
