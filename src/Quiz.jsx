import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import { FaRulerVertical, FaWeight, FaTshirt } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";

export default function Quiz() {

  const navigate = useNavigate();

  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [size, setSize] = useState("");
  const [loading, setLoading] = useState(false);
  const [bodyType, setBodyType] = useState("");

  // 🔥 Auto body type detection (simple AI feel)
  const calculateBodyType = (h, w) => {
    const heightM = h / 100;
    const bmi = w / (heightM * heightM);

    if (bmi < 18.5) return "Slim";
    if (bmi < 24.9) return "Balanced";
    if (bmi < 29.9) return "Curvy";
    return "Plus Size";
  };

  const handleHeightChange = (val) => {
    setHeight(val);
    if (val && weight) {
      setBodyType(calculateBodyType(val, weight));
    }
  };

  const handleWeightChange = (val) => {
    setWeight(val);
    if (height && val) {
      setBodyType(calculateBodyType(height, val));
    }
  };

  const submitQuiz = () => {

    if (!height || !weight || !size) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    const data = { height, weight, size, bodyType };

    setTimeout(() => {
      localStorage.setItem("glamziBody", JSON.stringify(data));
      navigate("/home");
    }, 800);
  };

  return (

    <div className="container">

      <h1 className="logo">GLAMZI</h1>
      <p className="tagline">Your Fashion Profile</p>

      {/* 🔥 Step Indicator */}
      <p className="step-indicator">Step 1 of 2</p>

      <div className="card">

        <h2>Body Quiz</h2>

        <div className="input-group">
          <FaRulerVertical className="icon" />
          <input
            type="number"
            placeholder="Height (cm)"
            value={height}
            onChange={(e) => handleHeightChange(e.target.value)}
          />
        </div>

        <div className="input-group">
          <FaWeight className="icon" />
          <input
            type="number"
            placeholder="Weight (kg)"
            value={weight}
            onChange={(e) => handleWeightChange(e.target.value)}
          />
        </div>

        <div className="input-group">
          <FaTshirt className="icon" />
          <select
            value={size}
            onChange={(e) => setSize(e.target.value)}
          >
            <option value="">Select Size</option>
            <option>XS</option>
            <option>S</option>
            <option>M</option>
            <option>L</option>
            <option>XL</option>
          </select>
        </div>

        {/* 🔥 AI Feedback */}
        {bodyType && (
          <p className="ai-result">
            AI suggests your body type: <strong>{bodyType}</strong>
          </p>
        )}

        <button
          className={`generate ${loading ? "loading" : ""}`}
          onClick={submitQuiz}
          disabled={loading}
        >
          {loading ? "Generating..." : (
            <>
              <HiSparkles /> Start Styling
            </>
          )}
        </button>

      </div>

    </div>
  );
}