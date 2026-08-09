import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "20mb" }));

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// API Routes

// Cardamom Market Price API Endpoint
app.get("/api/market-price", (req, res) => {
  res.json({
    updatedAt: new Date().toISOString(),
    location: "Bodinayakanur / Vandanmedu Auction Centers",
    currency: "INR",
    unit: "kg",
    averagePrice: 2485,
    grade8mm: 2950,
    grade7to8mm: 2520,
    unassorted: 2150,
    dailyArrivalsKg: 48200,
    priceChangePct: +2.4,
    trend: "up",
    history: [
      { date: "Day 1", price: 2350 },
      { date: "Day 2", price: 2380 },
      { date: "Day 3", price: 2410 },
      { date: "Day 4", price: 2400 },
      { date: "Day 5", price: 2445 },
      { date: "Day 6", price: 2460 },
      { date: "Today", price: 2485 },
    ],
  });
});

// AI Assistant Route - Handles Q&A, Disease Diagnosis, Fertilizer & Yield Calculations, Farm Performance Summaries
app.post("/api/gemini/assistant", async (req, res) => {
  try {
    const { action, prompt, imageBase64, farmData } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "GEMINI_API_KEY is missing. Please configure it in Settings > Secrets.",
      });
    }

    const systemInstruction = `You are "Elaichi-Mitra", an expert AI agronomy assistant specialized in commercial Cardamom cultivation (Elettaria cardamomum - Green Cardamom). 
You provide practical, accurate, scientific advice on cardamom farming including soil management, shade tree regulation (e.g. Dadap, Karuna, Cedar), pest and disease diagnosis (Capsule rot / Azhukal, Thrips, Stem borer, Fusarium, Root grub, Katte virus), fertilizer calculations (NPK 75:75:150 kg/ha), irrigation, post-harvest curing/drying (retaining green color at 45-50°C), and farm financial optimization.

Formatting rules:
- Give concise, structured, bulleted advice optimized for mobile view.
- When calculations are requested, provide step-by-step numbers.
- Provide practical spray dosage in mL or grams per 100L or 200L spray tank.`;

    if (action === "diagnose_disease" && imageBase64) {
      // Clean base64 string
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
      
      const imagePart = {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Data,
        },
      };

      const textPart = {
        text: prompt || "Analyze this image of cardamom plant/capsule/leaf. Identify any symptoms of pest, fungal, or viral disease (e.g. Azhukal/Capsule Rot, Thrips damage, Chenthal, Root Grub, Katte Virus, Shoot Borer). Provide specific organic or chemical treatment recommendations with exact dosage and preventive practices.",
      };

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: { parts: [imagePart, textPart] },
        config: { systemInstruction },
      });

      return res.json({ reply: response.text });
    }

    if (action === "summarize_performance" && farmData) {
      const summaryPrompt = `Analyze the following cardamom farm metrics and generate a executive performance summary with strengths, areas of improvement, cost optimization tips, and yield boosting advice:
Farm Data:
${JSON.stringify(farmData, null, 2)}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: summaryPrompt,
        config: { systemInstruction },
      });

      return res.json({ reply: response.text });
    }

    // Default Q&A or calculation chat
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt || "How do I maximize green cardamom yield and maintain high grade capsule quality?",
      config: { systemInstruction },
    });

    return res.json({ reply: response.text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({ error: error.message || "Failed to process request with AI assistant." });
  }
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Cardamom Farm Management Server running on http://localhost:${PORT}`);
  });
}

startServer();
