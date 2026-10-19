import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import "../App.css";
import "./TeilenPage.css";

export function TeilenPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  async function handleTeilen() {
    if (!email.trim()) {
      alert("Bitte eine E-Mail eingeben.");
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:5000/api/lists/${slug}/share`,
        { email },
      );

      alert(res.data.message || "Liste wurde geteilt!");
      navigate(`/todo/${slug}`);
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message ||
        "Es ist ein Fehler beim Teilen der Liste aufgetreten.";
      alert(msg);
    }
  }
  return (
    <div className="app-container">
      <button className="back-button" onClick={() => navigate(`/todo/${slug}`)}>
        ← Zurück zur Liste
      </button>
      <h1 className="Überschrift">Teilen</h1>
      <input
        type="text"
        placeholder="E-Mail des Empfängers"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleTeilen}>Teilen</button>
    </div>
  );
}
