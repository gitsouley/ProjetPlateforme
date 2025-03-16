import React from 'react';
import EnseignantDashboard from '../Test/EnseignantDashboard';

function Enseignant() {
  return (
      <div className="enseignant-dashboard">
        <h1>Tableau de Bord Enseignant</h1>
        {/* <div className="dashboard-options"> */}
          <EnseignantDashboard />
        {/* </div> */}
      </div>
  )
}

export default Enseignant;
