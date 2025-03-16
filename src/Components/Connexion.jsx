import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "./../Images/logo.jpeg";
//import "../App.css";

function Connexion() {
  const navigate = useNavigate();
  const location = useLocation();
  const { who } = location.state || {}; // Récupère le type d'utilisateur (optionnel)

  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Fonction de soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
  
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: motDePasse, who }), // Envoi de who
      });
  
      const data = await response.json();
  
      if (response.ok) {
  
        // Redirection selon le rôle
        if (who === "etudiant") {
          navigate("/etudiant", { state: { user: data } });
        } else  {
          navigate("/enseignant", { state: { user: data } });
        }
      } else {
        setErrorMessage(data.error || "Email ou mot de passe incorrect.");
      }
    } catch (error) {
      console.error("Erreur de connexion :", error);
      setErrorMessage("Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <>
      <div className="header" style={styles.header}>
        <img src={logo} alt="Logo" style={styles.logo} />
        <h1>Ensemble, passons chaque examen.</h1>
      </div>

      <div style={styles.container}>
        <h2>Connexion</h2>
        {errorMessage && <p style={styles.error}>{errorMessage}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label>Email :</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label>Mot de passe :</label>
            <input
              type="password"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p>
          Vous n'avez pas de compte ?
          <button onClick={() => navigate("/Inscription", { state: { who : who } })} style={styles.toggleButton}>
            S'inscrire
          </button>
        </p>
      </div>
    </>
  );
}

// Styles CSS
const styles = {
  header: {
    background: "linear-gradient(to right, #3b82f6, #6366f1)",
    color: "white",
    padding: "20px",
    textAlign: "center",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  },
  logo: {
    width: "80px",
    borderRadius: "50%",
  },
  container: {
    maxWidth: "400px",
    margin: "40px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  formGroup: {
    marginBottom: "15px",
    textAlign: "left",
  },
  input: {
    padding: "8px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    width: "100%",
  },
  button: {
    padding: "10px",
    fontSize: "16px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  toggleButton: {
    background: "none",
    border: "none",
    color: "#007bff",
    cursor: "pointer",
    textDecoration: "underline",
    marginLeft: "5px",
  },
  error: {
    color: "red",
    fontSize: "14px",
  },
};

export default Connexion;










































// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useLocation } from 'react-router-dom';
// import logo from "./../Images/logo.jpeg";
// import Etudiant from '../Pages/Etudiant';
// import '../App.css';

// function Connexion() {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState('');
//   const [motDePasse, setMotDePasse] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');
//   const location = useLocation();
//   const { who } = location.state || {};
//   {/*
//     import { useState } from "react";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [user, setUser] = useState(null);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch("http://localhost:5000/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setUser(data); // Stocker les infos utilisateur
//         alert("Connexion réussie !");
//       } else {
//         alert(data.error);
//       }
//     } catch (error) {
//       console.error("Erreur :", error);
//     }
//   };

//   return (
//     <div>
//       <form onSubmit={handleLogin}>
//         <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
//         <input type="password" placeholder="Mot de passe" onChange={(e) => setPassword(e.target.value)} required />
//         <button type="submit">Se connecter</button>
//       </form>
//       {user && <h3>Bienvenue, {user.prenom} {user.nom} !</h3>}
//     </div>
//   );
// };

// export default Login;

//     */}
//   //il faut se rappeller comment interroger la base de donnée whoooooooooo
//   // Données de test pour les connexions
//   const users = {
//     etudiant: { email: "etudiant@test.com", password: "etudiant123" },
//     enseignant: { email: "enseignant@test.com", password: "enseignant123" },
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();


//     console.log(who);
//     // Vérification des identifiants
//     if (email === users.etudiant.email && motDePasse === users.etudiant.password) {
//       navigate("/etudiant");
//     } else if (email === users.enseignant.email && motDePasse === users.enseignant.password) {
//       navigate("/enseignant");
//     } else {
//       setErrorMessage("Email ou mot de passe incorrect.");
//     }
//   };

//   return (
//     <>
//       <div className="header" style={styles.header}>
//         <img src={logo} alt="Logo" style={styles.logo} />
//         <h1>Ensemble, passons chaque examen.</h1>
//       </div>

//       <div style={styles.container}>
//         <h2>Connexion</h2>
//         {errorMessage && <p style={styles.error}>{errorMessage}</p>}
//         <form onSubmit={handleSubmit} style={styles.form}>
//           <div style={styles.formGroup}>
//             <label>Email :</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               style={styles.input}
//             />
//           </div>
//           <div style={styles.formGroup}>
//             <label>Mot de passe :</label>
//             <input
//               type="password"
//               value={motDePasse}
//               onChange={(e) => setMotDePasse(e.target.value)}
//               required
//               style={styles.input}
//             />
//           </div>
//           <button type="submit" style={styles.button}>
//             Se connecter
//           </button>
//         </form>
//         <p>
//           Vous n'avez pas de compte ?
//           <button onClick={() => navigate("/Inscription")} style={styles.toggleButton}>
//             S'inscrire
//           </button>
//         </p>
//       </div>
//     </>
//   );
// }

// // Styles
// const styles = {
//   header: {
//     background: "linear-gradient(to right, #3b82f6, #6366f1)",
//     color: "white",
//     padding: "20px",
//     textAlign: "center",
//     boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
//   },
//   logo: {
//     width: "80px",
//     borderRadius: "50%",
//   },
//   container: {
//     maxWidth: "400px",
//     margin: "40px auto",
//     padding: "20px",
//     border: "1px solid #ccc",
//     borderRadius: "8px",
//     boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
//     textAlign: "center",
//   },
//   form: {
//     display: 'flex',
//     flexDirection: 'column',
//   },
//   formGroup: {
//     marginBottom: '15px',
//     textAlign: "left",
//   },
//   input: {
//     padding: '8px',
//     fontSize: '16px',
//     borderRadius: '4px',
//     border: '1px solid #ccc',
//     width: '100%',
//   },
//   button: {
//     padding: '10px',
//     fontSize: '16px',
//     backgroundColor: '#007bff',
//     color: '#fff',
//     border: 'none',
//     borderRadius: '4px',
//     cursor: 'pointer',
//   },
//   toggleButton: {
//     background: 'none',
//     border: 'none',
//     color: '#007bff',
//     cursor: 'pointer',
//     textDecoration: 'underline',
//     marginLeft: '5px',
//   },
//   error: {
//     color: 'red',
//     fontSize: '14px',
//   }
// };

// export default Connexion;
