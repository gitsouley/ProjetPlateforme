import { useState } from "react";
import { useLocation } from "react-router-dom";



function CreerDevoir() {
  const locate = useLocation();
  const { user } = locate.state || {}; // Récupérer l'identifiant de l'enseignant
  const idEnseignant = user?.id;


  const [matiere, setMatiere] = useState('');
  const [type, setType] = useState('Contrôle continu (CC)');
  const [dateDebut, setDateDebut] = useState('');
  const [duree, setDuree] = useState('');
  const [message, setMessage] = useState("");
  const [fichier, setFichier] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Calcul automatique de la date limite
    const dateDebutObj = new Date(dateDebut);
    const dateLimiteObj = new Date(dateDebutObj.getTime() + duree * 60000);
    const dateLimite = dateLimiteObj.toISOString().slice(0, 19).replace("T", " ");
  
    const formData = new FormData();
    formData.append("matiere", matiere);
    formData.append("type", type);
    formData.append("dateDebut", dateDebut);
    formData.append("dateLimite", dateLimite);
    if (fichier) formData.append("fichier", fichier);
    formData.append("idEnseignant", idEnseignant);
    console.log(formData);
  
    try {
      const response = await fetch(`http://localhost:5000/api/examens/`, {
        method: "POST",
        body: formData,
      });
      //console.log("c'est la");

      const result = await response.json();
      //console.log(" ou pas ");
      if (response.ok) {
        setMessage("Devoir créé avec succès !");

        // Réinitialiser les champs du formulaire
        setMatiere("");
        setType("");
        setDateDebut("");
        setDuree("");
        setFichier(null);
      } else {
        alert("Erreur : " + result.message);
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi :", error);
    }
  };
  



  return (
    <div className="creer-devoir-form">
      <h2>Créer un Devoir</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <label>Matière :</label>
        <input
          type="text"
          value={matiere}
          onChange={(e) => setMatiere(e.target.value)}
          required
        />

        <label>Type :</label>
        <select value={type} onChange={(e) => setType(e.target.value)} required>
          <option value="Contrôle continu (CC)">Contrôle continu (CC)</option>
          <option value="Devoir surveillé (DS)">Devoir surveillé (DS)</option>
          <option value="Travaux dirigés (TD)">Travaux dirigés (TD)</option>
          <option value="Travaux pratiques (TP)">Travaux pratiques (TP)</option>
          <option value="Projets">Projets</option>
        </select>  

        <label>Date de Début :</label>
        <input
          type="datetime-local"
          value={dateDebut}
          onChange={(e) => setDateDebut(e.target.value)}
          required
        />

        <label>Durée (en minutes) :</label>
        <input
          type="number"
          value={duree}
          onChange={(e) => setDuree(e.target.value)}
          required
        />

        <label>Télécharger un fichier (PDF/TXT) :</label>
        <input
          type="file"
          accept=".pdf,.txt"
          onChange={(e) => setFichier(e.target.files[0])}
          required
        />

        <button type="submit">Créer le Devoir</button>
      </form>
    </div>
  );
}

export default CreerDevoir;
