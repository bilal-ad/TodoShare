import axios from "axios";
import { Routes, Route } from "react-router";
import { LoginPage } from "./pages/LoginPage.jsx";
import { ListenPage } from "./pages/ListenPage.jsx";
import { RegestrierungPage } from "./pages/RegestrierungPage.jsx";
import { ToDoPage } from "./pages/ToDoPage.jsx";
import { ErstellungToDoPage } from "./pages/ErstellungToDoPage.jsx";
import { TeilenPage } from "./pages/TeilenPage.jsx";
import { BearbeitenToDoPage } from "./pages/BearbeitenToDoPage.jsx";
import { ErstellungListePage } from "./pages/ErstellungListePage.jsx";
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [lists, setLists] = useState([]);

  const loadLists = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/lists");
      setLists(response.data);
    } catch (err) {
      console.error("Fehler beim Laden der Listen", err);
    }
  };

  useEffect(() => {
    loadLists();
  }, []);

  return (
    <>
      <Routes>
        <Route index element={<LoginPage />} />
        <Route path="registrierung" element={<RegestrierungPage />} />

        <Route
          path="listenansicht"
          element={<ListenPage lists={lists} loadLists={loadLists} />}
        />
        <Route
          path="liste-erstellen"
          element={<ErstellungListePage lists={lists} loadLists={loadLists} />}
        />

        <Route path="/todo/:slug" element={<ToDoPage />} />
        <Route path="/todo/:slug/erstellen" element={<ErstellungToDoPage />} />
        <Route
          path="/todo/:slug/bearbeiten/:todoId"
          element={<BearbeitenToDoPage />}
        />
        <Route path="/todo/:slug/teilen" element={<TeilenPage />} />
      </Routes>
    </>
  );
}

export default App;
