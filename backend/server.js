const express = require("express");
const cors = require("cors");
const multer = require("multer");
const axios = require("axios");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer for image uploads
const upload = multer();

// Check HuggingFace token
if (!process.env.HF_TOKEN) {
  console.log("❌ HF_TOKEN missing in .env file");
  process.exit(1);
}

console.log("HF TOKEN:", process.env.HF_TOKEN ? "Loaded ✅" : "Missing ❌");

// Test route
app.get("/", (req, res) => {
  res.send("GLAMZI Backend Running 🚀");
});


// ==========================================
// AI TRY-ON GENERATION
// ==========================================

app.post("/generate", upload.single("image"), async (req, res) => {

  console.log("🔥 /generate endpoint called");

  try {

    const { category, weather, customPrompt } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const prompt = `
A realistic fashion photoshoot of the SAME PERSON in the uploaded photo.
The person is wearing a stylish ${category} outfit suitable for ${weather} weather.
Luxury designer fashion, cinematic lighting, ultra realistic clothing.
${customPrompt || ""}
`;

    console.log("Prompt:", prompt);

    const response = await axios.post(
      "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
      {
        inputs: prompt,
        options: { wait_for_model: true }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json"
        },
        responseType: "arraybuffer",
        timeout: 120000
      }
    );

    console.log("✅ Styled image generated");

    const base64Image = Buffer.from(response.data).toString("base64");

    res.json({
      image: `data:image/png;base64,${base64Image}`
    });

  } catch (error) {

    console.log("❌ FULL ERROR:");

    if (error.response) {
      console.log(error.response.data.toString());
    } else {
      console.log(error.message);
    }

    res.status(500).json({
      message: "AI generation failed"
    });
  }

});


// ==========================================
// AI FASHION CHATBOT
// ==========================================

app.post("/chat", async (req, res) => {

  try {

    const { message } = req.body;

    const prompt = `
You are GLAMZI, an AI fashion stylist.
Give short helpful outfit advice.

User question: ${message}
`;

    const response = await axios.post(
      "https://api-inference.huggingface.co/models/google/flan-t5-large",
      {
        inputs: prompt
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`
        }
      }
    );

    res.json({
      reply: response.data[0]?.generated_text || "No advice available."
    });

  } catch (error) {

    console.log("❌ Chat Error:", error.message);

    res.status(500).json({
      reply: "AI stylist unavailable right now."
    });
  }

});


// ==========================================
// AI OUTFIT RATING
// ==========================================

app.post("/rate-outfit", async (req, res) => {

  try {

    const { description } = req.body;

    const prompt = `
Rate this fashion outfit from 1 to 10 and explain briefly.

Outfit: ${description}
`;

    const response = await axios.post(
      "https://api-inference.huggingface.co/models/google/flan-t5-large",
      {
        inputs: prompt
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`
        }
      }
    );

    res.json({
      rating: response.data[0]?.generated_text || "No rating available."
    });

  } catch (error) {

    console.log("❌ Rating Error:", error.message);

    res.status(500).json({
      rating: "Unable to rate outfit right now."
    });

  }

});


// ==========================================
// START SERVER
// ==========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 GLAMZI Backend Running on Port ${PORT}`);
});