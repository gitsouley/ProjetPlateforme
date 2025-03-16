import React, { useState } from 'react';
import './styles.css'; // Importez le fichier CSS
import CreerDevoir from './CreerDevoir';
import ListeDevoirs from './ListeDevoirs';
import ConsulterCopies from './ConsulterCopies';
import AccederStatistique from './AccederStatistique';
import { useLocation } from 'react-router-dom';

function EnseignantDashboard() {
  const [view, setView] = useState('creer');

  return (
    <div style={{display: "flex"}}>
      <div>
          <nav className="enseignant-nav">
            <button onClick={() => setView('creer')}>Créer un Devoir</button>
            <button onClick={() => setView('liste')}>Liste des Devoirs</button>
            <button onClick={() => setView('statistiques')}>Statistiques</button> {/* Nouveau bouton */}
          </nav>
      </div>
        <div className="enseignant-dashboard">
          {/* <h1>Tableau de Bord de l'Enseignant</h1> */}
          {view === 'creer' && <CreerDevoir />}
          {view === 'liste' && <ListeDevoirs setView={setView} />}
          {view === 'consulter' && <ConsulterCopies />}
          {view === 'statistiques' && <AccederStatistique />} {/* Nouvelle vue */}
        </div>
    </div>
  );
}

export default EnseignantDashboard;