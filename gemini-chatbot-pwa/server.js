import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const port = 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: message,
    });

    res.json({
      reply: response.text || "No response generated.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message || "Something went wrong",
    });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});