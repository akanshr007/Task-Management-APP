// src/App.jsx
import React from "react";
import TaskList from "./Components/TaskList"; // Importing TaskList component

function App() {
  return (
    <div>
      <h1>Task Manager</h1>
      <TaskList /> {/* Your task manager component */}
    </div>
  );
}

export default App;
