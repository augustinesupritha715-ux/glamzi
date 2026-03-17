import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import logo from "./logo.png";
import { HiSparkles } from "react-icons/hi2";

export default function Login() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      alert("Please enter your name");
      return;
    }

    if (trimmedName.length < 3) {
      alert("Name should be at least 3 characters");
      return;
    }

    setLoading(true);

    // simulate smooth transition
    setTimeout(() => {
      localStorage.setItem("glamzi_user", trimmedName);
      navigate("/quiz");
    }, 800);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
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

        <button
          className={`generate ${loading ? "loading" : ""}`}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Entering..." : (
            <>
              <HiSparkles /> Enter Glamzi
            </>
          )}
        </button>
      </div>
    </div>
  );
}