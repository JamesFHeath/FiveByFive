import React, { useEffect, useState } from "react";
import { initDB, saveDatabase } from "./db.js";
import { createRoot } from "react-dom/client";
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

  const addWorkout = async () => {
    db.exec({
      sql: "INSERT INTO workouts (date, exercise, weight, reps) VALUES (?, ?, ?, ?)",
      bind: ["2023-10-25", "Bench Press", 135, 10],
    });

    await saveDatabase();
  };

  if (loading) {
    return <p>Loading database...</p>;
  }
  if (!db) {
    return <p>Error loading database. Are you in private browsing mode?</p>;
  }

  return <h1>Five by Five!</h1>;
}

const root = createRoot(document.getElementById("react-root"));
root.render(<App />);
