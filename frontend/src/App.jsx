import { useState, useEffect } from "react"
import axios from "axios"
import "./App.css"
import {
  FaTshirt,
  FaGlassCheers,
  FaCrown,
  FaSun,
  FaCloud,
  FaSnowflake,
  FaTrash,
  FaSparkles,
  FaSave,
} from "react-icons/fa"

export default function App() {
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [category, setCategory] = useState("casual")
  const [weather, setWeather] = useState("sunny")
  const [customPrompt, setCustomPrompt] = useState("")
  const [wardrobe, setWardrobe] = useState([])

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("glamzi")) || []
    setWardrobe(saved)
  }, [])

  const handleImage = (e) => {
    const file = e.target.files[0]
    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  const generateStyle = async () => {
    if (!image) return alert("Upload an image first")

    const formData = new FormData()
    formData.append("image", image)
    formData.append("category", category)
    formData.append("weather", weather)
    formData.append("customPrompt", customPrompt)

    try {
      setLoading(true)
      const res = await axios.post("http://localhost:5000/generate", formData)
      setResult(res.data.image)
    } catch (error) {
      alert("Something went wrong. Check backend.")
    } finally {
      setLoading(false)
    }
  }

  const saveLook = () => {
    const newLook = { image: result, category, weather }
    const updated = [newLook, ...wardrobe]
    setWardrobe(updated)
    localStorage.setItem("glamzi", JSON.stringify(updated))
    alert("Saved to Wardrobe 💎")
  }

  const deleteLook = (index) => {
    const updated = wardrobe.filter((_, i) => i !== index)
    setWardrobe(updated)
    localStorage.setItem("glamzi", JSON.stringify(updated))
  }

  return (
    <div className="container">
      <h1 className="logo">GLAMZI</h1>
      <p className="tagline">AI POWERED LUXURY FASHION</p>

      {/* Upload + Controls */}
      <div className="card">
        <input type="file" onChange={handleImage} />

        {preview && <img src={preview} className="preview" />}

        <div className="selectors">
          <h3>Choose Category</h3>
          <div className="options">
            <button
              className={category === "casual" ? "active" : ""}
              onClick={() => setCategory("casual")}
            >
              <FaTshirt className="icon" /> Casual
            </button>

            <button
              className={category === "party" ? "active" : ""}
              onClick={() => setCategory("party")}
            >
              <FaGlassCheers className="icon" /> Party
            </button>

            <button
              className={category === "runway" ? "active" : ""}
              onClick={() => setCategory("runway")}
            >
              <FaCrown className="icon" /> Runway
            </button>
          </div>

          <h3>Weather</h3>
          <div className="options">
            <button
              className={weather === "sunny" ? "active" : ""}
              onClick={() => setWeather("sunny")}
            >
              <FaSun className="icon" /> Sunny
            </button>

            <button
              className={weather === "cloudy" ? "active" : ""}
              onClick={() => setWeather("cloudy")}
            >
              <FaCloud className="icon" /> Cloudy
            </button>

            <button
              className={weather === "winter" ? "active" : ""}
              onClick={() => setWeather("winter")}
            >
              <FaSnowflake className="icon" /> Winter
            </button>
          </div>
        </div>

        <textarea
          placeholder="Add extra styling instructions..."
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
        />

        <button
          className={`generate ${loading ? "loading" : ""}`}
          onClick={generateStyle}
          disabled={loading}
        >
          {loading ? (
            <>
              <FaSparkles className="spin" /> Styling...
            </>
          ) : (
            <>
              <FaSparkles /> Generate Luxury Look
            </>
          )}
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className="card">
          <h2>Styled Look</h2>
          <img src={result} className="preview result-animate" />

          <button onClick={saveLook} className="generate save-btn">
            <FaSave /> Save Look
          </button>
        </div>
      )}

      {/* Wardrobe */}
      {wardrobe.length > 0 && (
        <div className="card">
          <h2>Your Wardrobe</h2>
          <div className="gallery">
            {wardrobe.map((item, index) => (
              <div key={index} className="gallery-item">
                <img src={item.image} className="preview" />

                <button
                  className="delete-btn"
                  onClick={() => deleteLook(index)}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} GLAMZI</p>
        <p className="made">
          Made with 💜 by You | AI Powered Fashion
        </p>
      </footer>
    </div>
  )
}