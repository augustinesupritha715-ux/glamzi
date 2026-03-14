import { useState, useEffect, useRef } from "react";
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
  FaCamera
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

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("glamzi")) || [];
    setWardrobe(saved);
  }, []);

  // Upload image
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // Start camera
  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
  };

  // Capture from camera
  const capturePhoto = () => {

    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {

      const file = new File([blob], "camera.jpg");

      setImage(file);
      setPreview(URL.createObjectURL(blob));

    });
  };

  // Generate AI outfit
  const generateStyle = async () => {

    if (!image) {
      alert("Upload or capture image first");
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
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setResult(res.data.image);

    } catch {

      alert("AI generation failed");

    } finally {

      setLoading(false);
    }
  };

  // Save outfit
  const saveLook = () => {

    const newLook = { image: result };

    const updated = [newLook, ...wardrobe];

    setWardrobe(updated);

    localStorage.setItem("glamzi", JSON.stringify(updated));
  };

  const deleteLook = (index) => {

    const updated = wardrobe.filter((_, i) => i !== index);

    setWardrobe(updated);

    localStorage.setItem("glamzi", JSON.stringify(updated));
  };

  return (
    <div className="container">

      <h1 className="logo">GLAMZI</h1>
      <p className="tagline">AI Virtual Fashion Assistant</p>

      <div className="card">

        <input type="file" onChange={handleImage} />

        <button onClick={startCamera}>
          <FaCamera /> Start Camera
        </button>

        <video ref={videoRef} autoPlay width="250"></video>

        <button onClick={capturePhoto}>
          Capture Photo
        </button>

        <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

        {preview && <img src={preview} className="preview" alt="preview" />}

        <h3>Category</h3>

        <div className="options">

          <button onClick={() => setCategory("casual")}>
            <FaTshirt /> Casual
          </button>

          <button onClick={() => setCategory("party")}>
            <FaGlassCheers /> Party
          </button>

          <button onClick={() => setCategory("runway")}>
            <FaCrown /> Runway
          </button>

        </div>

        <h3>Weather</h3>

        <div className="options">

          <button onClick={() => setWeather("sunny")}>
            <FaSun /> Sunny
          </button>

          <button onClick={() => setWeather("cloudy")}>
            <FaCloud /> Cloudy
          </button>

          <button onClick={() => setWeather("winter")}>
            <FaSnowflake /> Winter
          </button>

        </div>

        <textarea
          placeholder="Extra styling instructions"
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
        />

        <button onClick={generateStyle}>

          {loading ? "Generating..." : (
            <>
              <HiSparkles /> Generate Luxury Look
            </>
          )}

        </button>

      </div>

      {result && (
        <div className="card">

          <h2>Styled Look</h2>

          <img src={result} className="preview" alt="result" />

          <button onClick={saveLook}>
            <FaSave /> Save Look
          </button>

        </div>
      )}

      {wardrobe.length > 0 && (
        <div className="card">

          <h2>Your Wardrobe</h2>

          {wardrobe.map((item, index) => (

            <div key={index}>

              <img src={item.image} className="preview" alt="wardrobe" />

              <button onClick={() => deleteLook(index)}>
                <FaTrash />
              </button>

            </div>

          ))}

        </div>
      )}

    </div>
  );
}