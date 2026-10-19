import { useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import axios from "axios";
import "../App.css";

export function RegestrierungPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setpassword2] = useState("");

  async function handleRegistration() {
    if (email.trim() === "" || password.trim() === "") {
      toast.error("Bitte füllen Sie alle Felder aus!");
      return;
    }

    if (password !== password2) {
      toast.error("Die Passwörter stimmen nicht überein!");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/auth/registrieren", {
        email,
        password,
      });

      toast.success("Sie wurden erfolgreich registriert!");

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      const message =
        err.response?.data?.message || "Registrierung fehlgeschlagen.";
      toast.error(message);
      console.error(err);
    }
  }

  return (
    <>
      <div className="app-container">
        <h1>Registrierung</h1>
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
        <input
          type="password"
          placeholder="Passwort bestätigen"
          value={password2}
          onChange={(eingabe) => setpassword2(eingabe.target.value)}
        />
        <button onClick={handleRegistration}>Registrieren</button>
      </div>
    </>
  );
}
