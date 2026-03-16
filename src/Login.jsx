import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import logo from "./logo.png";
import { HiSparkles } from "react-icons/hi2";

export default function Login() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      alert("Please enter your name");
      return;
    }

    // save user
    localStorage.setItem("glamzi_user", trimmedName);

    // go to quiz page
    navigate("/quiz");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="container">

      <img src={logo} alt="Glamzi Logo" className="login-logo" />

      <h1 className="logo">GLAMZI</h1>
      <p className="tagline">AI POWERED LUXURY FASHION</p>

      <div className="card">

        <h2>Welcome</h2>

        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          autoFocus
          onKeyDown={handleKeyPress}
          onChange={(e) => setName(e.target.value)}
        />

        <button className="generate" onClick={handleLogin}>
          <HiSparkles /> Enter Glamzi
        </button>

      </div>

    </div>
  );
}