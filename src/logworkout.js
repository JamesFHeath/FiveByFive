import React, { useEffect, useState } from "react";

function today() {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

export default function LogWorkout({ db, onSaved }) {
  const [types, setTypes] = useState([]);
  const [date, setDate] = useState(today());
  const [typeId, setTypeId] = useState("");
  const [weight, setWeight] = useState(135);
  const [sets, setSets] = useState(5);
  const [reps, setReps] = useState(5);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!db) return;
    const rows = db.exec({
      sql: "SELECT id, name FROM workout_types ORDER BY id;",
      rowMode: "object",
      returnValue: "resultRows",
    });
    setTypes(rows);
    if (rows.length > 0) setTypeId(String(rows[0].id));
  }, [db]);

  const save = () => {
    if (!typeId) {
      setMessage("Please pick a workout type.");
      return;
    }
    db.exec({
      sql: "INSERT INTO workouts (date, type_id, weight, sets, reps) VALUES (?, ?, ?, ?, ?)",
      bind: [date, Number(typeId), Number(weight), Number(sets), Number(reps)],
    });
    setMessage("Saved!");
    if (onSaved) onSaved();
    setTimeout(() => setMessage(""), 2000);
  };

  const numberOptions = Array.from({ length: 20 }, (_, i) => i + 1);

  return (
    <div>
      <div className="form-row">
        <label>Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div className="form-row">
        <label>Exercise</label>
        <select value={typeId} onChange={(e) => setTypeId(e.target.value)}>
          {types.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-row">
        <label>Weight (lbs)</label>
        <input
          type="number"
          inputMode="numeric"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          step={5}
          min={0}
        />
      </div>

      <div className="form-row">
        <label>Sets</label>
        <select value={sets} onChange={(e) => setSets(e.target.value)}>
          {numberOptions.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      <div className="form-row">
        <label>Reps</label>
        <select value={reps} onChange={(e) => setReps(e.target.value)}>
          {numberOptions.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={save}
        style={{ padding: "10px 20px", cursor: "pointer", marginTop: 10 }}
      >
        Save Workout
      </button>

      {message && <p style={{ marginTop: 10 }}>{message}</p>}
    </div>
  );
}
