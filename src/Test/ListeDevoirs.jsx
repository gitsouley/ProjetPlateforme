import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

function ListeDevoirs({ setView }) {
  const locate = useLocation();
  const { user } = locate.state || {};
  const idEnseignant = user?.id;

  const [examens, setExamens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [correction, setCorrection] = useState("");

  useEffect(() => {
    const fetchExamens = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/examens/${idEnseignant}`);
        setExamens(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des examens", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExamens();
  }, []);

  const publierExamen = async (idExamen) => {
    try {
      await axios.put(`http://localhost:5000/api/examens/${idExamen}`, { publie: true });

      // ✅ Mettre à jour l'état immédiatement
      setExamens((prevExamens) =>
        prevExamens.map((examen) =>
          examen.idExamen === idExamen ? { ...examen, publie: true } : examen
        )
      );
    } catch (error) {
      console.error("Erreur lors de la publication de l'examen", error);
    }
  };

  const consulterCorrection = async (idExamen) => {
    setCorrection("Génération de la correction en cours...");
    try {
      const response = await axios.get(`http://localhost:5001/api/correction/${idExamen}`);

      setCorrection(response.data.correction);
    } catch (error) {
      console.error("Erreur lors de la récupération de la correction", error);
      setCorrection("Erreur lors de la récupération de la correction.");
    }
  };

  return (
    <div className="liste-devoirs">
      <h2>Liste des Examens</h2>

      {loading ? (
        <p>Chargement des examens...</p>
      ) : (
        <ul>
          {examens.map((devoir) => (
            <li key={devoir.idExamen}>
              <strong>{devoir.titre}</strong> <br />
              Durée : {devoir.duree} min
              <p>Date de début : {devoir.dateDebut}</p>
              <p>Date limite : {devoir.dateLimite}</p>

              {devoir.publie ? (
                <span style={{ color: "green" }}>Publié</span>
              ) : (
                <button onClick={() => publierExamen(devoir.idExamen)}>Publier</button>
              )}

              <button onClick={() => consulterCorrection(devoir.idExamen)}>Consulter la correction IA</button>

              <button onClick={() => setView("consulter")}>Consulter les Copies</button>
            </li>
          ))}
        </ul>
      )}

      {correction && (
        <div className="correction">
          <h3>Correction IA :</h3>
          <p>{correction}</p>
        </div>
      )}
    </div>
  );
}

export default ListeDevoirs;
