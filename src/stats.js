import React, { useEffect, useState } from "react";

export default function Stats({ db }) {
  const [types, setTypes] = useState([]);
  const [typeId, setTypeId] = useState("");
  const [workouts, setWorkouts] = useState([]);

  const stats = workouts[0];

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

  const getWorkouts = () => {
    if (!db || !typeId) return;

    try {
      const rows = db.exec({
        sql: `
        SELECT MAX(weight) AS max_weight,
               AVG(weight) AS avg_weight,
               COUNT(*) AS session_count
        FROM workouts
        WHERE type_id = ?
      `,
        bind: [Number(typeId)],
        rowMode: "object",
        returnValue: "resultRows",
      });
      setWorkouts(rows);
      console.log(rows);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getWorkouts();
  }, [db, typeId]);

  return (
    <div>
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
      {stats && stats.session_count > 0 ? (
        <div className="stats-grid">
          <div className="stat">
            <span className="stat-label">Max Weight</span>
            <span className="stat-value">{stats.max_weight} lbs</span>
          </div>
          <div className="stat">
            <span className="stat-label">Average Weight</span>
            <span className="stat-value">
              {Math.round(stats.avg_weight)} lbs
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">Sessions</span>
            <span className="stat-value">{stats.session_count}</span>
          </div>
        </div>
      ) : (
        <p>No workouts logged for this exercise yet.</p>
      )}
    </div>
  );
}
