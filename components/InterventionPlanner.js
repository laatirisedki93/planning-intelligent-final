
import { useState } from "react";

export default function InterventionPlanner() {
  const [interventions, setInterventions] = useState([]);
  const [lieu, setLieu] = useState("");
  const [typeTravaux, setTypeTravaux] = useState("");
  const [urgence, setUrgence] = useState("");
  const [description, setDescription] = useState("");

  const etablissements = [
    "École maternelle Bleuet",
    "École maternelle Césaire",
    "École maternelle Condorcet",
    "École maternelle D'Estienne d'Orves",
    "École maternelle Gambetta",
    "École maternelle Petit-Prince",
    "École maternelle Rimbaud",
    "École élémentaire Brossolette",
    "École élémentaire Carnot",
    "École élémentaire Cottereau",
    "École élémentaire D'Estienne d'Orves",
    "École élémentaire Langevin",
    "École élémentaire Lerenard",
    "École élémentaire Quatremaire",
    "École élémentaire Ravel",
    "École élémentaire Wallon",
    "Crèche municipale Les Petits Pas",
    "Crèche municipale Arc-en-Ciel",
    "Crèche familiale Pomme d’Api",
    "Centre social Langevin",
    "Centre municipal de santé",
    "Gymnase Henri Wallon",
    "Gymnase Langevin",
    "Stade Huvier",
    "Maison de la jeunesse",
    "Mairie principale",
    "Médiathèque Roger Gouhier",
    "Autre..."
  ];

  const typesTravaux = [
    "Plomberie",
    "Électricité",
    "Menuiserie",
    "Chauffage",
    "Peinture",
    "Vérification sécurité",
    "Autre"
  ];

  const urgences = ["Faible", "Moyenne", "Élevée", "Urgente"];

  const ajouterIntervention = () => {
    if (!lieu || !typeTravaux || !urgence) return;
    setInterventions([
      ...interventions,
      { lieu, typeTravaux, urgence, description }
    ]);
    setLieu("");
    setTypeTravaux("");
    setUrgence("");
    setDescription("");
  };

  const genererPlanning = async () => {
    const res = await fetch("/api/gpt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ interventions })
    });
    const data = await res.json();
    alert("Résultat GPT :\n\n" + data.resultat);
  };

  return (
    <div style={{ padding: 40, maxWidth: 700, margin: "auto", fontFamily: "Arial, sans-serif" }}>
      <img src="/logo-ville-site.webp" alt="Logo" style={{ maxWidth: 120, marginBottom: 20 }} />
      <h1 style={{ fontSize: "24px", marginBottom: 20 }}>🛠️ Planification intelligente des interventions</h1>

      <select value={lieu} onChange={(e) => setLieu(e.target.value)} style={{ display: "block", width: "100%", marginBottom: 10, padding: 10 }}>
        <option value="">📍 Sélection du lieu</option>
        {etablissements.map((e) => (
          <option key={e} value={e}>{e}</option>
        ))}
      </select>

      <select value={typeTravaux} onChange={(e) => setTypeTravaux(e.target.value)} style={{ display: "block", width: "100%", marginBottom: 10, padding: 10 }}>
        <option value="">🧰 Type de travaux</option>
        {typesTravaux.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      <select value={urgence} onChange={(e) => setUrgence(e.target.value)} style={{ display: "block", width: "100%", marginBottom: 10, padding: 10 }}>
        <option value="">⚠️ Urgence</option>
        {urgences.map((u) => (
          <option key={u} value={u}>{u}</option>
        ))}
      </select>

      <textarea
        placeholder="📝 Description de l'intervention"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
        style={{ display: "block", width: "100%", marginBottom: 10, padding: 10 }}
      />

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <button onClick={ajouterIntervention} style={{ padding: "10px 20px" }}>➕ Ajouter</button>
        <button onClick={genererPlanning} style={{ padding: "10px 20px" }}>⚙️ Générer</button>
      </div>

      <ul style={{ listStyle: "none", paddingLeft: 0 }}>
        {interventions.map((i, idx) => (
          <li key={idx} style={{ marginBottom: 15, borderBottom: "1px solid #ddd", paddingBottom: 10 }}>
            <b>{i.lieu}</b> – {i.typeTravaux} – <span style={{ color: "tomato" }}>{i.urgence}</span><br />
            <i>{i.description}</i>
          </li>
        ))}
      </ul>
    </div>
  );
}
