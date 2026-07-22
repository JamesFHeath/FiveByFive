import React, { useEffect, useState } from "react";

export default function Settings({ db }) {
  const [name, setName] = useState("");

  const addWorkoutType = (name) => {
    if (!db) return;
    try {
      db.exec({
        sql: "INSERT INTO workout_types (name) VALUES (?);",
        bind: [name],
      });
      setName("");
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div>
      <h2>Add a Workout Type</h2>

      <div className="form-row">
        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <button
        onClick={() => addWorkoutType(name)}
        style={{ padding: "10px 20px", cursor: "pointer", marginTop: 10 }}
      >
        Save Workout Type
      </button>
    </div>
  );
}
