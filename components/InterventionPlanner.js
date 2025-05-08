
import { useState } from "react";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";

export default function InterventionPlanner() {
  const [interventions, setInterventions] = useState([]);
  const [lieu, setLieu] = useState("");
  const [typeTravaux, setTypeTravaux] = useState("");
  const [urgence, setUrgence] = useState("");
  const [description, setDescription] = useState("");
  const [resultatGPT, setResultatGPT] = useState("");

  const etablissements = [
    "École maternelle Bleuet", "École maternelle Césaire", "École maternelle Condorcet",
    "École maternelle D'Estienne d'Orves", "École maternelle Gambetta", "École maternelle Petit-Prince",
    "École maternelle Rimbaud", "École élémentaire Brossolette", "École élémentaire Carnot",
    "École élémentaire Cottereau", "École élémentaire D'Estienne d'Orves", "École élémentaire Langevin",
    "École élémentaire Lerenard", "École élémentaire Quatremaire", "École élémentaire Ravel",
    "École élémentaire Wallon", "Crèche municipale Les Petits Pas", "Crèche municipale Arc-en-Ciel",
    "Crèche familiale Pomme d’Api", "Centre social Langevin", "Centre municipal de santé",
    "Gymnase Henri Wallon", "Gymnase Langevin", "Stade Huvier", "Maison de la jeunesse",
    "Mairie principale", "Médiathèque Roger Gouhier", "Autre..."
  ];

  const typesTravaux = [
    "Plomberie", "Électricité", "Menuiserie", "Chauffage", "Peinture", "Sécurité", "Autre"
  ];

  const urgences = ["Faible", "Moyenne", "Élevée", "Urgente"];

  const ajouterIntervention = () => {
    if (!lieu || !typeTravaux || !urgence) return;
    setInterventions([
      ...interventions,
      { lieu, typeTravaux, urgence, description }
    ]);
    setLieu(""); setTypeTravaux(""); setUrgence(""); setDescription("");
  };

  const genererPlanning = async () => {
    const res = await fetch("/api/gpt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ interventions })
    });
    const data = await res.json();
    setResultatGPT(data.resultat);
  };

  const exporterWord = async () => {
    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({ children: [new TextRun({ text: "Planning optimisé", bold: true, size: 32 })] }),
          ...resultatGPT.split("\n").map(line => new Paragraph(line))
        ]
      }]
    });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, "planning.docx");
  };

  return (
    <div style={{ padding: 40, maxWidth: 700, margin: "auto", fontFamily: "Arial" }}>
      <img src="/logo-ville-site.webp" alt="Logo" style={{ maxWidth: 120, marginBottom: 20 }} />
      <h1>🛠️ Planification intelligente</h1>

      <select value={lieu} onChange={(e) => setLieu(e.target.value)} style={{ width: "100%", marginBottom: 10 }}>
        <option value="">📍 Sélection du lieu</option>
        {etablissements.map(e => <option key={e}>{e}</option>)}
      </select>

      <select value={typeTravaux} onChange={(e) => setTypeTravaux(e.target.value)} style={{ width: "100%", marginBottom: 10 }}>
        <option value="">🧰 Type de travaux</option>
        {typesTravaux.map(t => <option key={t}>{t}</option>)}
      </select>

      <select value={urgence} onChange={(e) => setUrgence(e.target.value)} style={{ width: "100%", marginBottom: 10 }}>
        <option value="">⚠️ Urgence</option>
        {urgences.map(u => <option key={u}>{u}</option>)}
      </select>

      <textarea
        placeholder="📝 Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
        style={{ width: "100%", marginBottom: 10 }}
      />

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <button onClick={ajouterIntervention}>➕ Ajouter</button>
        <button onClick={genererPlanning}>⚙️ Générer</button>
        <button onClick={exporterWord}>⬇️ Exporter Word</button>
      </div>

      <div style={{ background: "#f4f4f4", padding: 10, borderRadius: 5, whiteSpace: "pre-line" }}>
        {resultatGPT}
      </div>
    </div>
  );
}
