import React, { useState } from "react";
import "./TaskList.css"
const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState("");

  const addTask = () => {
    if (taskText.trim() === "") return;
    setTasks([...tasks, taskText]);
    setTaskText("");
  };
  const deleteTask = (index) => {

    setTasks(tasks.filter((_, i) => i !== index));
  };

  return (
    <div className="task-container">
      <h2>Task Manager</h2>
      <div className="task-input">
        <input
          type="text"
          placeholder="Add a new task..."
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
        />
        <button onClick={addTask}>Add Task</button>
      </div>
      <ul className="task-list">
        {tasks.map((task, index) => (
          <li key={index}>
            <span>{task}</span>
            <button onClick= {()=> deleteTask(index)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
