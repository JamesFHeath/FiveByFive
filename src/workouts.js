import React, { useEffect, useState } from "react";

export default function Workouts({ db }) {
  const [results, setResults] = useState([]);
  const [columns, setColumns] = useState([]);

  const deleteRow = (id) => {
    if (!db) return;
    try {
      db.exec({
        sql: "DELETE FROM workouts WHERE id = ?;",
        bind: [id],
      });
      runQuery("SELECT * FROM workouts ORDER BY date DESC");
    } catch (err) {
      console.error(err);
    }
  };

  const runQuery = async (query) => {
    setResults([]);
    setColumns([]);

    if (!db) {
      return;
    }

    try {
      const rows = db.exec({
        sql: query,
        rowMode: "object",
        returnValue: "resultRows",
      });

      if (rows && rows.length > 0) {
        setResults(rows);
        setColumns(Object.keys(rows[0]));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    runQuery("SELECT * FROM workouts ORDER BY date DESC");
  }, [db]);

  return (
    <div>
      {/* Dynamic Results Table */}
      {results.length > 0 && (
        <div style={{ overflowX: "auto", marginTop: "20px" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f5f5f5" }}>
                {columns.map((col) => (
                  <th
                    key={col}
                    style={{ border: "1px solid #ccc", padding: "8px" }}
                  >
                    {col}
                  </th>
                ))}
                <th style={{ border: "1px solid #ccc", padding: "8px" }}></th>
              </tr>
            </thead>
            <tbody>
              {results.map((row, idx) => (
                <tr key={idx}>
                  {columns.map((col) => (
                    <td
                      key={col}
                      style={{ border: "1px solid #eee", padding: "8px" }}
                    >
                      {row[col] !== null ? String(row[col]) : "NULL"}
                    </td>
                  ))}
                  <td
                    style={{
                      border: "1px solid #eee",
                      padding: "8px",
                      textAlign: "center",
                    }}
                  >
                    <button
                      onClick={() => deleteRow(row.id)}
                      style={{
                        cursor: "pointer",
                        border: "none",
                        background: "none",
                        color: "#c62828",
                        fontWeight: "bold",
                      }}
                    >
                      X
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
