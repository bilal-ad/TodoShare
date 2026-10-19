import axios from "axios";
import "../App.css";
import { useState } from "react";
import { useNavigate } from "react-router";

export function ErstellungListePage({ lists, loadLists }) {
  const [listenName, setListenName] = useState("");
  const navigate = useNavigate();

  const slugify = (text) => text.toString().toLowerCase().trim();

  async function handleCreateList() {
    if (!listenName.trim()) return;

    const slug = slugify(listenName);

    if (lists.some((l) => l.slug === slug)) {
      alert("Diese Liste existiert bereits!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/lists", {
        name: listenName.trim(),
        slug,
      });

      loadLists();

      navigate("/listenansicht");
    } catch (err) {
      alert("Es ist ein Fehler beim Erstellen der Liste aufgetreten.");
      console.error(err);
    }
  }

  return (
    <div className="app-container">
      <button
        className="back-button"
        onClick={() => navigate("/listenansicht")}
      >
        ← Zurück zur Listenansicht
      </button>
      <h1>Erstellung Liste</h1>
      <input
        type="text"
        placeholder="Listenname"
        value={listenName}
        onChange={(e) => setListenName(e.target.value)}
        className="Input-ToDo"
      />
      <button onClick={handleCreateList}>Liste erstellen</button>
    </div>
  );
}
