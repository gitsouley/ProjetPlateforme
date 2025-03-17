const express = require("express");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
require("dotenv").config();
const fs = require('fs');
const db = require("./db"); // Importation de la connexion MySQL

const app = express();
app.use(cors());
app.use(express.json());


//configuration de multer pour stocké les fichiers dans le dossier /uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Dossier où seront stockés les fichiers
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nom unique pour chaque fichier
  },
});

const upload = multer({ storage });


// 🚀 Route d'inscription
app.post("/register", async (req, res) => {
  const { who, prenom, nom, email, motDePasse } = req.body;

  if (!who || !prenom || !nom || !email || !motDePasse) {
    return res.status(400).json({ error: "Tous les champs sont requis !" });
  }

  let tableName;
  if (who === "etudiant") {
    tableName = "Etudiant";
  } else if (who === "enseignant") {
    tableName = "Enseignant";
  } else {
    return res.status(400).json({ error: "Type d'utilisateur invalide." });
  }

  try {
    // Vérifier si l'email existe déjà
    const checkEmailQuery = `SELECT * FROM ${tableName} WHERE email_ = ?`;
    db.query(checkEmailQuery, [email], async (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Erreur serveur" });
      }

      if (results.length > 0) {
        return res.status(400).json({ error: "Cet email est déjà utilisé !" });
      }

      // Hachage du mot de passe
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(motDePasse, salt);

      // Insérer l'utilisateur dans la base de données
      const insertQuery = `INSERT INTO ${tableName} (prenom, nom, email_, motDepasse) VALUES (?, ?, ?, ?)`;
      db.query(insertQuery, [prenom, nom, email, hashedPassword], (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erreur lors de l'inscription" });
        }
        res.status(201).json({ message: "Inscription réussie !" });
      });
    });
  } catch (error) {
    res.status(500).json({ error: "Une erreur est survenue" });
  }
});

// 🚀 Route de connexion
app.post("/login", (req, res) => {
  const { email, password, who } = req.body;

  let tableName;
  if (who === "etudiant") {
    tableName = "Etudiant";
  } else if (who === "enseignant") {
    tableName = "Enseignant";
  } else {
    return res.status(400).json({ error: "Type d'utilisateur invalide." });
  }

  const query = `SELECT * FROM ${tableName} WHERE email_ = ?`;
  db.query(query, [email], async (err, results) => {
    if (err) {
      console.error("Erreur SQL :", err);
      return res.status(500).json({ error: "Erreur serveur." });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect." });
    }

    const user = results[0];

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.motDepasse);
    if (!isMatch) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect." });
    }

    // Retourner les infos de l'utilisateur sans le mot de passe
    res.json({
      id: user.idEtudiant || user.idEnseignant,
      prenom: user.prenom,
      nom: user.nom,
      email: user.email_,
      who,
    });
  });
});




// Récupérer la liste des examens publiés avec le nom du professeur pour eleve
app.get("/api/exams", (req, res) => {
  const sql = `
    SELECT e.idExamen AS id, e.titre AS title, e.fichier AS fileUrl, 
           e.publie, COALESCE(ens.nom, 'Inconnu') AS teacher 
    FROM Examen e
    LEFT JOIN Enseignant ens ON e.idEnseignant = ens.idEnseignant
    WHERE e.publie = 1
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Erreur lors de la récupération des examens :", err);
      return res.status(500).json({ error: "Erreur serveur" });
    }
    res.json(results);
  });
});




// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
app.get('/api/correction/:idExamen', (req, res) => {
    const { idExamen } = req.params;

    // Vérifier si l'examen a une correction en base de données
    db.query('SELECT nomCorrige FROM Correction WHERE idExamen = ?', [idExamen], (err, results) => {
        if (err) return res.status(500).json({ message: "Erreur serveur" });

        if (results.length === 0) {
            return res.status(404).json({ message: "Aucune correction trouvée. L'IA va générer une correction." });
        }

        // Vérifier si le fichier existe sur le disque
        const filePath = path.join(__dirname, 'corrections', results[0].nomCorrige);
        if (fs.existsSync(filePath)) {
            return res.sendFile(filePath);
        } else {
            return res.status(404).json({ message: "Fichier de correction introuvable. L'IA va générer une correction." });
        }
    });
});



app.post('/api/ia/correction', (req, res) => {
    const { idExamen } = req.body;

    // Simuler une correction générée par l'IA
    const correctionIA = `Correction automatique pour l'examen ${idExamen}: Réponse correcte...`;

    // Définir le nom du fichier
    const fileName = `ia_correction_${idExamen}.txt`;
    const filePath = path.join(__dirname, 'corrections', fileName);

    // Sauvegarder la correction dans un fichier
    fs.writeFileSync(filePath, correctionIA, 'utf8');

    // Enregistrer la correction en base de données
    db.query('INSERT INTO Correction (nomCorrige, idExamen) VALUES (?, ?)', [fileName, idExamen], (err) => {
        if (err) return res.status(500).json({ message: "Erreur lors de l'enregistrement de la correction." });

        res.json({ message: "Correction générée et enregistrée.", correction: correctionIA });
    });
});












// 🚀 Route pour créer un devoir
app.post("/api/examens/", upload.single("fichier"), (req, res) => {
  const { matiere, type, dateDebut, dateLimite, idEnseignant} = req.body;
  const fichier = req.file ? req.file.filename : null; // Vérifie si un fichier a été envoyé

  if (!matiere || !type || !dateDebut || !dateLimite) {
    return res.status(400).json({ error: "Tous les champs sont requis !" });
  }

  const sql = `INSERT INTO Examen (titre, type, dateDebut, dateLimite, fichier, idEnseignant) VALUES (?, ?, ?, ?, ?, ?)`;
  db.query(sql, [matiere, type, dateDebut, dateLimite, fichier, parseInt(idEnseignant)], (err, result) => {
    if (err) {
      console.error("Erreur SQL :", err);
      return res.status(500).json({ error: "Erreur lors de l'ajout du devoir" });
    }
    res.status(201).json({ message: "Devoir créé avec succès !" });
  });
});

//Récupérer les examens 
app.get('/api/examens/:id', (req, res) => {
  console.log("req.params:", req.params);
  const teacherId = req.params.id; // Prendre l'ID de l'enseignant connecté
  db.query('SELECT * FROM Examen WHERE idEnseignant = ?', [teacherId], (err, results) => {
    if (err) return res.status(500).json({ message: "Erreur serveur" });
    res.json(results);
  });
});



//Mettre à jour un examen pour le publier
app.put('/api/examens/:id', (req, res) => {
  const { id } = req.params;
  const { publie } = req.body; // Publier ou non l'examen

  db.query('UPDATE Examen SET publie = ? WHERE idExamen = ?', [publie, id], (err, result) => {
    if (err) return res.status(500).json({ message: "Erreur de mise à jour" });
    res.json({ message: 'Examen mis à jour avec succès' });
  });
});


//correction proposée par l'IA
app.get('/api/correction/:id', (req, res) => {
  const { id } = req.params;
  // Logique pour récupérer la correction de l'IA
  // Simulons ici la réponse de l'IA
  res.json({ correction: "Correction générée par l'IA pour l'examen " + id });
});



// Lancer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur backend en écoute sur le port ${PORT}`);
});
