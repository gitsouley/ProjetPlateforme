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
                "Authorization": `Bearer ${API_KEY}`
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
    console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});
*/

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const API_KEY = process.env.DEEPSEEK_API_KEY; // Utilisation de la clé Groq

app.use(cors());
app.use(express.json());

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
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "mixtral-8x7b-32768", // Tu peux tester aussi "llama3-8b"
                messages: [
                    { 
                        role: "user", 
                        content: prompt 
                    },
                    {
                        role: "system",
                        content: "Réponds uniquement en français."
                    }
                ]
            })
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

app.listen(PORT, () => {
    console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});
