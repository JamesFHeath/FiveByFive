import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { initDB, loadDatabaseFromFile, downloadDatabase } from "./db.js";
import Tabs from "./tabs.js";
import "./styles.css";

function App() {
  const [db, setDb] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initDB()
      .then((database) => {
        setDb(database);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const database = await loadDatabaseFromFile(file);
    setDb(database);
    e.target.value = "";
  };

  if (loading) return <p>Loading database...</p>;
  if (!db) return <p>Error loading database.</p>;

  return (
    <div>
      <h1 style={{ textAlign: "center", fontFamily: "sans-serif" }}>
        Five by Five
      </h1>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <button onClick={() => downloadDatabase()}>Download DB</button>
        <label style={{ marginLeft: 10, cursor: "pointer" }}>
          Upload DB
          <input
            type="file"
            accept=".sqlite3,.db,.sqlite"
            onChange={handleUpload}
            style={{ display: "none" }}
          />
        </label>
      </div>
      <Tabs db={db} />
    </div>
  );
}

createRoot(document.getElementById("react-root")).render(<App />);
