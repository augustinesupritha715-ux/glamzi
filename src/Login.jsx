import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import logo from "./logo.png";

export default function Login() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!name) {
      alert("Enter your name");
      return;
    }

    localStorage.setItem("glamzi_user", name);
    navigate("/home");
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
          onChange={(e) => setName(e.target.value)}
        />

        <button className="generate" onClick={handleLogin}>
          Enter Glamzi
        </button>
      </div>
    </div>
  );
}