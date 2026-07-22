import React, { useState } from "react";

import LogWorkout from "./logworkout.js";
import RawData from "./rawdata.js";

export default function Tabs({ db }) {
  const [activeTab, setActiveTab] = useState("log");

  return (
    <div className="tabs-container">
      <div className="tab-buttons">
        <button
          className={activeTab === "log" ? "active" : ""}
          onClick={() => setActiveTab("log")}
        >
          Log Workout
        </button>
        <button
          className={activeTab === "visualization" ? "active" : ""}
          onClick={() => setActiveTab("visualization")}
        >
          Visualization
        </button>
        <button
          className={activeTab === "stats" ? "active" : ""}
          onClick={() => setActiveTab("stats")}
        >
          Stats
        </button>
        <button
          className={activeTab === "raw" ? "active" : ""}
          onClick={() => setActiveTab("raw")}
        >
          Raw Data
        </button>
        <button
          className={activeTab === "settings" ? "active" : ""}
          onClick={() => setActiveTab("settings")}
        >
          Settings
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "log" && <LogWorkout db={db} />}

        {activeTab === "history" && (
          <div>
            <h2>Workout History</h2>
            <p>Your previous workouts will load from SQLite here.</p>
          </div>
        )}

        {activeTab === "stats" && (
          <div>
            <h2>Personal Records</h2>
            <p>Your 1-rep maxes will go here.</p>
          </div>
        )}

        {activeTab === "raw" && <RawData db={db} />}

        {activeTab === "settings" && (
          <div>
            <h2>Settings</h2>
            <p>Add additonal workout types</p>
          </div>
        )}
      </div>
    </div>
  );
}
