import axios from "axios";
import "../App.css";
import "./ToDoPage.css";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";

export function ToDoPage() {
  const [query, setQuery] = useState("");
  const [list, setList] = useState(null);
  const navigate = useNavigate();
  const { slug } = useParams();

  const loadList = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/lists/${slug}`,
      );
      setList(response.data);
    } catch (err) {
      console.error("Fehler beim Laden der Liste", err);
    }
  };

  useEffect(() => {
    loadList();
  }, [slug]);

  if (list === null) {
    return (
      <div className="app-container">
        <h1>Lädt...</h1>
      </div>
    );
  }

  const norm = (s) => (s || "").toString().toLowerCase().trim();

  const todos = list?.todos ?? [];

  const filtered = !norm(query)
    ? todos
    : todos.filter((t) => norm(t.titel).includes(norm(query)));

  function goToErstellungToDO() {
    navigate(`/todo/${slug}/erstellen`);
  }

  async function handleLoeschen() {
    try {
      await axios.delete(`http://localhost:5000/api/lists/${slug}`);

      alert("Liste wurde gelöscht!");
      navigate(`/listenansicht`);
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message ||
        "Es ist ein Fehler beim Löschen der Liste aufgetreten.";
      alert(msg);
    }
  }

  return (
    <>
      <div className="app-container">
        <div className="top-bar">
          <button
            className="back-button"
            onClick={() => navigate("/listenansicht")}
          >
            ← Zurück zur Listenansicht
          </button>

          <button
            className="share-button"
            onClick={() => navigate(`/todo/${slug}/teilen`)}
          >
            → Teilen
          </button>
        </div>
        <h1>{list.name}</h1>
        <input
          type="text"
          placeholder="Suchen"
          className="Input-ToDo"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {filtered.map((todo) => {
          return (
            <div
              key={todo.id}
              className="todo-item"
              onClick={() => navigate(`/todo/${slug}/bearbeiten/${todo._id}`)}
            >
              <label className="checkbox-row">
                <input type="checkbox" />
                {todo.titel}
              </label>
            </div>
          );
        })}

        <button onClick={goToErstellungToDO} className="button-neuesToDo">
          + Neues ToDo
        </button>

        <button onClick={handleLoeschen} className="button-loeschen">
          Liste löschen
        </button>
      </div>
    </>
  );
}
