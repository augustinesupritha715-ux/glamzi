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

  const submitQuiz = () => {

    if (!height || !weight || !size) {
      alert("Please fill all fields");
      return;
    }

    const data = { height, weight, size };

    localStorage.setItem("glamziBody", JSON.stringify(data));

    // Go to Glamzi Generator
    navigate("/home");
  };

  return (

    <div className="container">

      <h1 className="logo">GLAMZI</h1>
      <p className="tagline">Your Fashion Profile</p>

      <div className="card">

        <h2>Body Quiz</h2>

        <div className="input-group">
          <FaRulerVertical className="icon" />
          <input
            placeholder="Height (cm)"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />
        </div>

        <div className="input-group">
          <FaWeight className="icon" />
          <input
            placeholder="Weight (kg)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
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

        <button className="generate" onClick={submitQuiz}>
          <HiSparkles /> Start Styling
        </button>

      </div>

    </div>

  );
}