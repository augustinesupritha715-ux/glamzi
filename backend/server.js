const express = require("express")
const cors = require("cors")
const multer = require("multer")
const axios = require("axios")
require("dotenv").config()

const app = express()

app.use(cors())
app.use(express.json())

const upload = multer()

console.log("HF TOKEN:", process.env.HF_TOKEN ? "Loaded ✅" : "Missing ❌")

// Test route
app.get("/", (req, res) => {
  res.send("GLAMZI Backend Running 🚀")
})

app.post("/generate", upload.single("image"), async (req, res) => {

  console.log("🔥 /generate endpoint called")

  try {

    const { category, weather, customPrompt } = req.body

    const prompt = `
Luxury fashion editorial of a ${category} outfit suitable for ${weather} weather,
high fashion runway photography, ultra realistic, premium fabrics, dramatic lighting,
8k fashion photography.
${customPrompt || ""}
`

    console.log("Prompt:", prompt)

    const response = await axios({
      method: "post",
      url: "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
      headers: {
        Authorization: `Bearer ${process.env.HF_TOKEN}`,
        "Content-Type": "application/json"
      },
      data: {
        inputs: prompt
      },
      responseType: "arraybuffer",
      timeout: 60000
    })

    console.log("✅ Image generated from HF")

    const base64 = Buffer.from(response.data).toString("base64")

    res.json({
      image: `data:image/png;base64,${base64}`
    })

  } catch (error) {

    console.log("❌ FULL ERROR:")
    console.log(error)

    if (error.response) {
      console.log("HF ERROR DATA:", error.response.data.toString())
    }

    res.status(500).json({
      message: "AI generation failed"
    })
  }
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`GLAMZI Backend Running on ${PORT} 🚀`)
})