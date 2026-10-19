import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";
import "./LoginPage.css";
import "../App.css";
import toast from "react-hot-toast";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function goToRegistration() {
    navigate("/registrierung");
  }

  async function handleLogin() {
    if (email.trim() === "" || password.trim() === "") {
      toast.error("Bitte füllen Sie alle Felder aus!");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Sie wurden erfolgreich angemeldet!");

      setTimeout(() => {
        navigate("/listenansicht");
      }, 1500);
    } catch (err) {
      const message = err.response?.data?.message || "Login fehlgeschlagen.";
      toast.error(message);
      console.error(err);
    }
  }
  return (
    <div className="app-container">
      <h1>Anmelden</h1>
      <input
        type="text"
        placeholder="E-Mail"
        value={email}
        onChange={(eingabe) => setEmail(eingabe.target.value)}
      />
      <input
        type="password"
        placeholder="Passwort"
        value={password}
        onChange={(eingabe) => setPassword(eingabe.target.value)}
      />
      <label className="checkbox-row">
        <input type="checkbox" />
        Eingeloggt bleiben
      </label>
      <button onClick={handleLogin}>Anmelden</button>
      <button onClick={goToRegistration} className="button-Registrierung">
        Registrieren
      </button>
    </div>
  );
}
