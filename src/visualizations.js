import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

export default function Visualizations({ db }) {
  const [types, setTypes] = useState([]);
  const [typeId, setTypeId] = useState("");
  const [granularity, setGranularity] = useState("weekly");
  const [workouts, setWorkouts] = useState([]);

  const canvasRef = useRef(null);
  const chartRef = useRef(null);

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

    const groupBy =
      granularity === "monthly"
        ? "strftime('%Y-%m', date)"
        : "strftime('%Y-%W', date)";

    try {
      const rows = db.exec({
        sql: `
        SELECT ${groupBy} AS period,
               MAX(weight) AS max_weight,
               AVG(weight) AS avg_weight,
               COUNT(*) AS session_count
        FROM workouts
        WHERE type_id = ?
        GROUP BY period
        ORDER BY period;
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
  }, [db, typeId, granularity]);

  useEffect(() => {
    if (!canvasRef.current || workouts.length === 0) return;

    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(canvasRef.current, {
      type: "line",
      data: {
        labels: workouts.map((w) => w.period),
        datasets: [
          {
            label: "Max Weight",
            data: workouts.map((w) => w.max_weight),
            borderColor: "rgba(0,123,255,1)",
            backgroundColor: "rgba(0,123,255,0.1)",
          },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false },
    });

    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, [workouts]);

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
      <div className="form-row">
        <label>Granularity</label>
        <select
          value={granularity}
          onChange={(e) => setGranularity(e.target.value)}
        >
          <option key="weekly" value="weekly">
            Weekly
          </option>
          <option key="monthly" value="monthly">
            Monthly
          </option>
        </select>
      </div>
      <div style={{height: 400, position: "relative"}}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}
