import React, { useState } from "react";

export default function RawData({ db }) {
  const [query, setQuery] = useState("SELECT * FROM workouts LIMIT 10;");
  const [results, setResults] = useState([]);
  const [columns, setColumns] = useState([]);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const runQuery = async () => {
    setMessage("");
    setIsError(false);
    setResults([]);
    setColumns([]);

    if (!db) {
      setMessage("Database not loaded.");
      setIsError(true);
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
        setMessage(`Returned ${rows.length} row(s).`);
      } else {
        setMessage("Query executed successfully (0 rows returned).");
      }

    } catch (err) {
      setMessage(`SQL Error: ${err.message}`);
      setIsError(true);
    }
  };

  return (
    <div>
      <h2>Raw Data Query</h2>
      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        rows={4}
        style={{
          width: "100%",
          fontFamily: "monospace",
          padding: "10px",
          marginBottom: "10px",
          boxSizing: "border-box",
        }}
      />
      <button
        onClick={runQuery}
        style={{ padding: "8px 16px", cursor: "pointer" }}
      >
        Execute Query
      </button>

      {/* Status Message */}
      {message && (
        <div
          style={{
            marginTop: "15px",
            padding: "10px",
            backgroundColor: isError ? "#ffebee" : "#e8f5e9",
            color: isError ? "#c62828" : "#2e7d32",
            borderRadius: "4px",
          }}
        >
          {message}
        </div>
      )}

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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
