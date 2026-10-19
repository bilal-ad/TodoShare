import { useNavigate } from "react-router";
import { useState, useMemo, useEffect } from "react";
import "../App.css";
import "./ListenPage.css";

export function ListenPage({ lists, loadLists }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  function handleNeueListe() {
    navigate("/liste-erstellen");
  }

  function goToList(slug) {
    navigate(`/todo/${slug}`);
  }

  const norm = (s) => (s || "").toLowerCase().trim();

  const filtered = useMemo(() => {
    const q = norm(query);
    if (!q) return lists;
    return lists.filter((list) => norm(list.name).includes(q));
  }, [lists, query]);

  useEffect(() => {
    loadLists();
  }, []);

  return (
    <div className="app-container">
      <button className="back-button" onClick={() => navigate("/")}>
        ← Zurück zur Anmeldung
      </button>
      <h1>Meine Liste</h1>

      <input
        type="text"
        placeholder="Suchen"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {filtered.map((list) => (
        <button
          key={list.id}
          onClick={() => goToList(list.slug)}
          className="button-hinzugefügteListen"
        >
          {list.name}
        </button>
      ))}

      <button onClick={handleNeueListe} className="button-unten">
        Neue Liste
      </button>
    </div>
  );
}
