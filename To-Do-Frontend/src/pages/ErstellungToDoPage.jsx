import axios from "axios";
import { useNavigate, useParams } from "react-router";
import { useState } from "react";
import "../App.css";
import "./ErstellungToDoPage.css";

export function ErstellungToDoPage() {
  const [titelInput, setTitelInput] = useState("");
  const [beschreibungInput, setBeschreibungInput] = useState("");
  const [kategorie, setKategorie] = useState("Sonstiges");
  const navigate = useNavigate();
  const { slug } = useParams();

  async function addTodo() {
    if (!titelInput.trim()) return;

    const norm = (s) => (s || "").toString().toLowerCase().trim();

    try {
      const list = await axios.get(`http://localhost:5000/api/lists/${slug}`);

      const todos = list.data.todos || [];

      const exists = todos.some((t) => norm(t.titel) === norm(titelInput));

      if (exists) {
        alert("Dieses ToDo existiert bereits in der Liste!");
        return;
      }

      await axios.post(`http://localhost:5000/api/lists/${slug}/todos`, {
        titel: titelInput,
        beschreibung: beschreibungInput,
        kategorie,
      });

      setTitelInput("");
      setBeschreibungInput("");
      setKategorie("Sonstiges");

      navigate(`/todo/${slug}`);
    } catch (err) {
      alert("Es ist ein Fehler beim Erstellen der ToDos aufgetreten.");
      console.error(err);
    }
  }

  return (
    <>
      <div className="app-container">
        <button
          className="back-button"
          onClick={() => navigate(`/todo/${slug}`)}
        >
          ← Zurück zur Liste
        </button>
        <h1>Neues ToDo:</h1>
        <p className="Überschriften">Titel</p>
        <input
          type="text"
          className="Input-ToDo"
          value={titelInput}
          onChange={(e) => setTitelInput(e.target.value)}
        />
        <p className="Überschriften">Beschreibung</p>
        <input
          type="text"
          className="Input-ToDo"
          value={beschreibungInput}
          onChange={(e) => setBeschreibungInput(e.target.value)}
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

        <button className="button-erstellen" onClick={addTodo}>
          Erstellen
        </button>
      </div>
    </>
  );
}
