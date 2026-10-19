import "../App.css";
import "./BearbeitenToDoPage.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";

export function BearbeitenToDoPage() {
  const { slug, todoId } = useParams();
  const navigate = useNavigate();
  const [titel, setTitel] = useState("");
  const [beschreibung, setBeschreibung] = useState("");
  const [kategorie, setKategorie] = useState("Sonstiges");

  async function loadTodo() {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/lists/${slug}/todos/${todoId}`,
      );

      setTitel(res.data.titel || "");
      setBeschreibung(res.data.beschreibung || "");
      setKategorie(res.data.kategorie || "Sonstiges");
    } catch (err) {
      console.error(err.response?.data || err);
      alert("ToDo konnte nicht geladen werden.");
    }
  }

  useEffect(() => {
    loadTodo();
  }, []);

  async function handleSpeichern() {
    if (!titel.trim()) return;

    try {
      await axios.put(
        `http://localhost:5000/api/lists/${slug}/todos/${todoId}`,
        {
          titel,
          beschreibung,
          kategorie,
        },
      );
    } catch (err) {
      alert("Es ist ein Fehler beim Speichern der ToDos aufgetreten.");
      console.error(err);
    }

    navigate(`/todo/${slug}`);
  }

  async function handleLoeschen() {
    try {
      await axios.delete(
        `http://localhost:5000/api/lists/${slug}/todos/${todoId}`,
      );
    } catch (err) {
      alert("Es ist ein Fehler beim Löschen der ToDos aufgetreten.");
      console.error(err);
    }

    navigate(`/todo/${slug}`);
  }

  return (
    <div className="app-container">
      <button className="back-button" onClick={() => navigate(`/todo/${slug}`)}>
        ← Zurück zur Liste
      </button>
      <h1>Bearbeiten</h1>
      <p className="Überschriften">Titel</p>
      <input
        type="text"
        className="Input-ToDo"
        value={titel}
        onChange={(e) => setTitel(e.target.value)}
      />

      <p className="Überschriften">Beschreibung</p>
      <input
        type="text"
        className="Input-ToDo"
        value={beschreibung}
        onChange={(e) => setBeschreibung(e.target.value)}
      />

      <label className="Kategroie-row">
        <p className="Überschriften">Kategorie</p>
        <select
          className="Kategorie-Auswahl"
          value={kategorie}
          onChange={(e) => setKategorie(e.target.value)}
        >
          <option>Lebensmittel</option>
          <option>Hausaufgaben</option>
          <option>Haushalt</option>
          <option>Sport</option>
          <option>Arbeit</option>
          <option>Einkaufen</option>
          <option>Gesundheit</option>
          <option>Finanzen</option>
          <option>Termine</option>
          <option>Freizeit</option>
          <option>Reisen</option>
          <option>Sonstiges</option>
        </select>
      </label>

      <button className="button-speichern" onClick={handleSpeichern}>
        Speichern
      </button>
      <button className="button-loeschen " onClick={handleLoeschen}>
        Löschen
      </button>
    </div>
  );
}
