import React, { useState } from "react";

import LogWorkout from "./logworkout.js";
import Settings from "./settings.js";
import Visualizations from "./visualizations.js";
import Workouts from "./workouts.js";

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
          className={activeTab === "workouts" ? "active" : ""}
          onClick={() => setActiveTab("workouts")}
        >
          Workouts
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

        {activeTab === "visualization" && <Visualizations db={db}/>}

        {activeTab === "stats" && (
          <div>
            <h2>Personal Records</h2>
            <p>Your 1-rep maxes will go here.</p>
          </div>
        )}

        {activeTab === "workouts" && <Workouts db={db} />}

        {activeTab === "settings" && <Settings db={db} />}
      </div>
    </div>
  );
}
