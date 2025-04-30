// src/App.jsx
import React from "react";
import TaskList from "./Components/TaskList"; // Importing TaskList component

function App() {
  return (
    <div className="app-container">
      <h1>Task Management App</h1>
      <TaskList /> {/* Your task manager component */}
    </div>
  );
}

export default App;
