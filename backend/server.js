require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const axios = require("axios");

const app = express();

// ==============================
// Middleware
// ==============================

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer();

// ==============================
// HuggingFace Token
// ==============================

const HF_TOKEN = process.env.HF_TOKEN;

if (!HF_TOKEN) {
  console.error("❌ HF_TOKEN missing in .env file");
  process.exit(1);
}

console.log("HF TOKEN:", HF_TOKEN ? "Loaded ✅" : "Missing ❌");

// ==============================
// Health Check
// ==============================

app.get("/", (req, res) => {
  res.json({
    status: "GLAMZI Backend Running 🚀",
  });
});

// ==============================
// AI STYLE GENERATION
// ==============================

app.post("/generate", upload.single("image"), async (req, res) => {

  console.log("🔥 /generate endpoint called");

  try {

    const { category, weather, customPrompt } = req.body;

    if (!req.file) {
      return res.status(400).json({
        message: "No image uploaded"
      });
    }

    const prompt = `
Ultra realistic fashion photoshoot,
professional studio lighting,
model wearing a stylish ${category} outfit,
designed for ${weather} weather,
luxury designer clothing,
Vogue magazine editorial style,
high detail fabric texture,
8k photography, cinematic lighting.
${customPrompt || ""}
`;

    console.log("Prompt:", prompt);

    const response = await axios({
      method: "POST",
      url: "https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-xl-base-1.0",
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
        Accept: "image/png"
      },
      data: {
        inputs: prompt
      },
      responseType: "arraybuffer",
      timeout: 180000
    });

    console.log("✅ Image generated");

    const base64Image = Buffer.from(response.data).toString("base64");

    res.json({
      image: `data:image/png;base64,${base64Image}`
    });

  } catch (error) {

    console.error("❌ AI Generation Error");

    if (error.response) {
      console.error(error.response.data.toString());
    } else {
      console.error(error.message);
    }

    res.status(500).json({
      message: "AI generation failed"
    });

  }

});

// ==============================
// AI FASHION CHATBOT
// ==============================

app.post("/chat", async (req, res) => {

  try {

    const { message } = req.body;

    const prompt = `
You are GLAMZI, an AI fashion stylist.
Give short helpful outfit advice.

User question: ${message}
`;

    const response = await axios.post(
      "https://router.huggingface.co/hf-inference/models/google/flan-t5-large",
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`
        }
      }
    );

    res.json({
      reply: response.data?.[0]?.generated_text || "No advice available."
    });

  } catch (error) {

    console.error("❌ Chat Error:", error.message);

    res.status(500).json({
      reply: "AI stylist unavailable right now."
    });

  }

});

// ==============================
// Start Server
// ==============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 GLAMZI Backend Running on Port ${PORT}`);
});