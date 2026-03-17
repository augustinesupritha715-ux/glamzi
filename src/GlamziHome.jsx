import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import {
  FaTshirt,
  FaGlassCheers,
  FaCrown,
  FaSun,
  FaCloud,
  FaSnowflake,
  FaTrash,
  FaSave,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";

export default function GlamziHome() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("casual");
  const [weather, setWeather] = useState("sunny");
  const [customPrompt, setCustomPrompt] = useState("");
  const [wardrobe, setWardrobe] = useState([]);

  // 🔥 NEW STATES
  const [bodyType, setBodyType] = useState("");
  const [aiTips, setAiTips] = useState("");
  const [styleNote, setStyleNote] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("glamzi")) || [];
    setWardrobe(saved);

    const bodyData = JSON.parse(localStorage.getItem("glamziBody"));
    if (bodyData?.bodyType) {
      setBodyType(bodyData.bodyType);

      if (bodyData.bodyType === "Slim") {
        setAiTips("Layered outfits & oversized styles enhance your frame.");
      } else if (bodyData.bodyType === "Balanced") {
        setAiTips("You can wear almost anything — try structured looks.");
      } else if (bodyData.bodyType === "Curvy") {
        setAiTips("Fitted styles with waist definition look elegant.");
      } else {
        setAiTips("Flowy fabrics & darker tones give luxury silhouette.");
      }
    }
  }, []);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const generateStyle = async () => {
    if (!image) {
      alert("Upload an image first");
      return;
    }

    const fullPrompt = `${customPrompt} | Body Type: ${bodyType} | Category: ${category} | Weather: ${weather} | Make it premium luxury fashion`;

    const formData = new FormData();
    formData.append("image", image);
    formData.append("category", category);
    formData.append("weather", weather);
    formData.append("customPrompt", fullPrompt);

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/generate",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResult(res.data.image);

      // 🔥 Smart AI style note
      setStyleNote(
        `Perfect ${category} look for ${weather} weather. Designed for ${bodyType} body type ✨`
      );

    } catch (error) {
      console.error("Backend Error:", error);
      alert("Something went wrong. Check backend.");
    } finally {
      setLoading(false);
    }
  };

  const saveLook = () => {
    const newLook = { image: result, category, weather };
    const updated = [newLook, ...wardrobe];
    setWardrobe(updated);
    localStorage.setItem("glamzi", JSON.stringify(updated));
    alert("Saved to Wardrobe 💎");
  };

  const deleteLook = (index) => {
    const updated = wardrobe.filter((_, i) => i !== index);
    setWardrobe(updated);
    localStorage.setItem("glamzi", JSON.stringify(updated));
  };

  return (
    <div className="container">
      <h1 className="logo">GLAMZI</h1>
      <p className="tagline">AI POWERED LUXURY FASHION</p>

      <div className="card">

        {/* Upload */}
        <input type="file" onChange={handleImage} />

        {preview && <img src={preview} className="preview" alt="preview" />}

        {/* AI INFO */}
        {bodyType && (
          <p className="ai-result">
            AI Detected: <strong>{bodyType}</strong>
          </p>
        )}

        {aiTips && <p className="ai-tip">{aiTips}</p>}

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
              <HiSparkles className="spin" /> Styling...
            </>
          ) : (
            <>
              <HiSparkles /> Generate Luxury Look
            </>
          )}
        </button>
      </div>

      {/* RESULT */}
      {result && (
        <div className="card">
          <h2>Styled Look</h2>

          <img src={result} className="preview result-animate" alt="result" />

          {/* AI STYLE NOTE */}
          <p className="ai-tip">{styleNote}</p>

          <button onClick={saveLook} className="generate save-btn">
            <FaSave /> Save Look
          </button>
        </div>
      )}

      {/* WARDROBE */}
      {wardrobe.length > 0 && (
        <div className="card">
          <h2>Your Wardrobe</h2>

          <div className="gallery">
            {wardrobe.map((item, index) => (
              <div key={index} className="gallery-item">
                <img src={item.image} className="preview" alt="wardrobe" />

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
    </div>
  );
}