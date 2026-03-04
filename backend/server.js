const express = require("express")
const cors = require("cors")
const multer = require("multer")
const axios = require("axios")
require("dotenv").config()

const app = express()
app.use(cors())
app.use(express.json())

const upload = multer()

app.post("/generate", upload.single("image"), async (req, res) => {
  try {
    const { category, weather, customPrompt } = req.body

    const prompt = `
Luxury fashion editorial of a ${category} outfit suitable for ${weather} weather.
High detail, cinematic lighting, premium fabrics, ultra realistic.
${customPrompt}
`

    const response = await axios({
      method: "POST",
      url: "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2",
      headers: {
        Authorization: `Bearer ${process.env.HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      data: {
        inputs: prompt,
      },
      responseType: "arraybuffer",
    })

    const base64 = Buffer.from(response.data).toString("base64")

    res.json({ image: `data:image/png;base64,${base64}` })

  } catch (err) {
    console.error(err.response?.data || err.message)
    res.status(500).json({ error: "AI generation failed" })
  }
})

app.listen(5000, () => console.log("Server running on port 5000 🚀"))