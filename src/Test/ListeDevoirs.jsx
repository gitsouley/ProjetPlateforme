import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ListeDevoirs({ setView }) {

  const [examens, setExamens] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExamens = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/examens/');
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
    try {
      const response = await axios.get(`http://localhost:5000/api/correction/${idExamen}`);
      alert(`Correction proposée : ${response.data.correction}`);
    } catch (error) {
      console.error("Erreur lors de la récupération de la correction", error);
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
                <span style={{ color: 'green' }}>Publié</span>
              ) : (
                <button onClick={() => publierExamen(devoir.idExamen)}>Publier</button>
              )}

              <button onClick={() => consulterCorrection(devoir.idExamen)}>
                Consulter la correction IA
              </button>

              <button onClick={() => setView('consulter')}>Consulter les Copies</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ListeDevoirs;
