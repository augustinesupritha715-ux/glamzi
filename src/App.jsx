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

export default function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("casual");
  const [weather, setWeather] = useState("sunny");
  const [customPrompt, setCustomPrompt] = useState("");
  const [wardrobe, setWardrobe] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("glamzi")) || [];
    setWardrobe(saved);
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

    const formData = new FormData();
    formData.append("image", image);
    formData.append("category", category);
    formData.append("weather", weather);
    formData.append("customPrompt", customPrompt);

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
    } catch (error) {
      console.error("Backend Error:", error);

      if (error.response) {
        alert(
          "Backend Error: " +
            (error.response.data?.message ||
              error.response.data?.error ||
              "Server error")
        );
      } else if (error.request) {
        alert("Backend not responding.");
      } else {
        alert("Error: " + error.message);
      }
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
        <input type="file" onChange={handleImage} />

        {preview && <img src={preview} className="preview" alt="preview" />}

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

      {result && (
        <div className="card">
          <h2>Styled Look</h2>

          <img src={result} className="preview result-animate" alt="result" />

          <button onClick={saveLook} className="generate save-btn">
            <FaSave /> Save Look
          </button>
        </div>
      )}

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

      <footer className="footer">
        <p>© {new Date().getFullYear()} GLAMZI</p>
        <p className="made">Made with 💜 by Augustine supritha | AI Powered Fashion</p>
      </footer>
    </div>
  );
}