/* import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const API_KEY = process.env.DEEPSEEK_API_KEY;

app.use(cors());
app.use(express.json());

app.post("/api/generate", async (req, res) => {
    console.log("📥 Requête reçue :", req.body);

    const { prompt } = req.body;
    if (!prompt) {
        return res.status(400).json({ error: "Le prompt est requis." });
    }

    try {
        const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": Bearer ${API_KEY}
            },
            body: JSON.stringify({
                model: "deepseek-chat",  // ✅ Assure-toi que ce modèle est valide
                messages: [{ role: "user", content: prompt }],  // ✅ DeepSeek attend ce format
                temperature: 0.7  // ✅ Contrôle la variabilité des réponses
            })
        });

        console.log("📤 DeepSeek API appelée...");

        const data = await response.json();
        console.log("✅ Réponse DeepSeek :", data);

        res.json({ response: data.choices?.[0]?.message?.content || "Pas de réponse." });

    } catch (error) {
        console.error("❌ Erreur API DeepSeek :", error);
        res.status(500).json({ error: "Erreur serveur." });
    }
});

app.listen(PORT, () => {
    console.log(🚀 Serveur lancé sur http://localhost:${PORT});
});
*/

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";
import mysql from "mysql2";
import fs from "fs";
import pdf from "pdf-parse";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const API_KEY = process.env.DEEPSEEK_API_KEY; // Utilisation de la clé Groq

// 🔌 Connexion à la base de données
const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "PLATEFORME",
});

db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Erreur de connexion à la base de données :", err);
    process.exit(1); // Arrêter le serveur si la connexion échoue
  } else {
    console.log("✅ Connexion à la base de données réussie !");
    connection.release();
  }
});

app.use(cors());
app.use(express.json());

// 🔹 Endpoint IA : Générer une réponse
app.post("/api/generate", async (req, res) => {
  console.log("📥 Requête reçue :", req.body);

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Le prompt est requis." });
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768",
        messages: [
          { role: "user", content: prompt },
          { role: "system", content: "Réponds uniquement en français." },
        ],
      }),
    });

    console.log("📤 Groq API appelée...");

    const data = await response.json();
    console.log("✅ Réponse Groq :", data);

    res.json({ response: data.choices?.[0]?.message?.content || "Pas de réponse." });

  } catch (error) {
    console.error("❌ Erreur API Groq :", error);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

// 🔹 Récupérer un examen et générer une correction IA
app.get("/api/correction/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const examenId = parseInt(id, 10);
    const [results] = await db.promise().query("SELECT * FROM Examen WHERE idExamen = ?", [examenId]);
    console.log("📋 Résultat SQL :", results);

    if (results.length === 0) {
      return res.status(404).json({ message: "Examen non trouvé" });
    }

    const examen = results[0];
    const fichierPath = `../uploads/${examen.fichier}`;

    if (!fs.existsSync(fichierPath)) {
      return res.status(404).json({ message: "Fichier non trouvé" });
    }

    const texteExamen = await extractTextFromFile(fichierPath);
    console.log("📄 Texte extrait :", texteExamen);

    console.log("📡 Envoi à l'IA pour correction...");
    const iaCorrection = await getAICorrection(texteExamen);
    console.log("✅ Réponse IA :", iaCorrection);


    res.json({ correction: iaCorrection });

  } catch (error) {
    console.error("❌ Erreur API :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// 🔹 Extraction de texte depuis un fichier PDF ou TXT
async function extractTextFromFile(filePath) {
    // const fichierPath = `../uploads/${fichierPath}`;
    console.log(`📂 Chemin du fichier : ${filePath}`);
    
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "Fichier non trouvé" });
    }
    

  if (filePath.endsWith(".pdf")) {
    const data = fs.readFileSync(filePath);
    const pdfData = await pdf(data);
    return pdfData.text;
  } else {
    return fs.readFileSync(filePath, "utf8");
  }
}

// 🔹 Fonction pour obtenir la correction depuis une API d'IA

const getAICorrection = async (texteExamen) => {
  console.log("📡 Envoi du texte à l'IA pour correction...");
  try {
      const prompt = `Corrige cet examen : \n\n${texteExamen}. Fournis une réponse détaillée.`;
      
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${API_KEY}`,
          },
          body: JSON.stringify({
              model: "mixtral-8x7b-32768",
              messages: [
                  { role: "user", content: prompt },
                  { role: "system", content: "Réponds uniquement en français." },
              ],
          }),
      });
      
      console.log("📤 Groq API appelée...");
      
      const data = await response.json();
      console.log("✅ Réponse Groq :", data);
      
      return data.choices?.[0]?.message?.content || "Pas de correction disponible.";
  } catch (error) {
      console.error("❌ Erreur API Groq :", error);
      return "Erreur lors de la génération de la correction.";
  }
};

// 🔥 Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});
