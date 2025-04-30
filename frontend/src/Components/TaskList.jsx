import { useState, useEffect } from "react";
import "./TaskList.css"
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, addTask, removeTask, toggleTaskCompletion } from "../Store/taskSlice";

const TaskList = () => {
  const { tasks, status, error } = useSelector((state) => state.tasks);
  const dispatch = useDispatch();
  const [taskText, setTaskText] = useState("");
  const [currentTablePage, setCurrentTablePage] = useState(1);
  const [filter, setFilter] = useState("all"); // "all", "active", "completed"
  const [errorMsg, setErrorMsg] = useState("");
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedTask, setDraggedTask] = useState(null);
  const tasksPerTablePage = 10;
  
  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    if (filter === "all") return true;
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });
  
  // Get current tasks for table pagination
  const indexOfLastTableTask = currentTablePage * tasksPerTablePage;
  const indexOfFirstTableTask = indexOfLastTableTask - tasksPerTablePage;
  const currentTableTasks = filteredTasks.slice(indexOfFirstTableTask, indexOfLastTableTask);
  const totalTablePages = Math.ceil(filteredTasks.length / tasksPerTablePage);
  
  // Count stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const activeTasks = totalTasks - completedTasks;

  // Format date
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Update errorMsg when status changes
  useEffect(() => {
    if (status === 'failed') {
      setErrorMsg(error || "An error occurred");
      setIsAddingTask(false);
      
      // Auto-clear error after 5 seconds
      const timer = setTimeout(() => {
        setErrorMsg("");
      }, 5000);
      
      return () => clearTimeout(timer);
    }
    
    if (status === 'succeeded' && isAddingTask) {
      setIsAddingTask(false);
    }
  }, [status, error, isAddingTask]);

  // Fetch tasks on component mount
  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  // Reset to first page when filter changes
  useEffect(() => {
    setCurrentTablePage(1);
  }, [filter]);

  const handleAddTask = () => {
    if (taskText.trim() === "") {
      setErrorMsg("Task text cannot be empty");
      setTimeout(() => setErrorMsg(""), 5000);
      return;
    }
    setIsAddingTask(true);
    dispatch(addTask(taskText));
    setTaskText("");
  };

  const handleDeleteTask = (id) => {
    dispatch(removeTask(id));
  };

  const handleToggleCompletion = (id, currentStatus) => {
    dispatch(toggleTaskCompletion({ id, completed: !currentStatus }));
  };

  // Change page
  const paginateTable = (pageNumber) => setCurrentTablePage(pageNumber);
  
  // Drag handlers
  const handleDragStart = (e, task) => {
    setIsDragging(true);
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
    // Make drag image transparent
    setTimeout(() => {
      e.target.style.opacity = "0.4";
    }, 0);
  };
  
  const handleDragEnd = (e) => {
    setIsDragging(false);
    setDraggedTask(null);
    e.target.style.opacity = "1";
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  return (
    <div className="task-container">
      <h2>Task Manager</h2>
      
      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-value">{totalTasks}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{activeTasks}</span>
          <span className="stat-label">Active</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{completedTasks}</span>
          <span className="stat-label">Completed</span>
        </div>
      </div>
      
      <div className="task-input">
        <input
          type="text"
          placeholder="Add a new task..."
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
          disabled={isAddingTask}
        />
        <button onClick={handleAddTask} disabled={isAddingTask}>
          {isAddingTask ? (
            <>
              <span className="loading-spinner-sm"></span>
              <span>Adding...</span>
            </>
          ) : (
            'Add Task'
          )}
        </button>
      </div>
      
      {errorMsg && <div className="error">{errorMsg}</div>}
      {status === 'loading' && !isAddingTask && (
        <div className="loading">
          <div className="loading-spinner"></div>
          <span>Loading tasks...</span>
        </div>
      )}
      
      {/* Task Table */}
      <div className="task-table-container">
        <div className="table-header">
          <h3>All Tasks</h3>
          <div className="filter-controls">
            <button 
              className={`filter-btn ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              <span>All</span>
              {filter === "all" && <span className="tasks-count">{totalTasks}</span>}
            </button>
            <button 
              className={`filter-btn ${filter === "active" ? "active" : ""}`}
              onClick={() => setFilter("active")}
            >
              <span>Active</span>
              {filter === "active" && <span className="tasks-count">{activeTasks}</span>}
            </button>
            <button 
              className={`filter-btn ${filter === "completed" ? "active" : ""}`}
              onClick={() => setFilter("completed")}
            >
              <span>Completed</span>
              {filter === "completed" && <span className="tasks-count">{completedTasks}</span>}
            </button>
          </div>
        </div>
        
        {filteredTasks.length === 0 && status !== 'loading' ? (
          <div className="no-tasks">
            <div className="empty-state-icon">📋</div>
            <p>
              {filter === "all" 
                ? "No tasks yet. Add a task to get started!" 
                : filter === "active" 
                  ? "No active tasks found." 
                  : "No completed tasks found."}
            </p>
            {filter !== "all" && (
              <button 
                className="empty-state-btn"
                onClick={() => setFilter("all")}
              >
                View All Tasks
              </button>
            )}
          </div>
        ) : (
          <>
            <table className="task-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Task</th>
                  <th>Created</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentTableTasks.map((task, index) => (
                  <tr 
                    key={task._id} 
                    className={task.completed ? 'completed' : ''}
                    draggable="true"
                    onDragStart={(e) => handleDragStart(e, task)}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    data-id={task._id}
                  >
                    <td>{indexOfFirstTableTask + index + 1}</td>
                    <td>{task.text}</td>
                    <td className="date-cell">{formatDate(task.createdAt)}</td>
                    <td>
                      <div className="status-toggle">
                        <input 
                          type="checkbox" 
                          checked={task.completed} 
                          onChange={() => handleToggleCompletion(task._id, task.completed)}
                          id={`task-${task._id}`}
                        />
                        <label htmlFor={`task-${task._id}`}>
                          {task.completed ? 'Completed' : 'Active'}
                        </label>
                      </div>
                    </td>
                    <td>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDeleteTask(task._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Table Pagination */}
            {filteredTasks.length > tasksPerTablePage && (
              <div className="pagination table-pagination">
                <button 
                  className={`pagination-btn ${currentTablePage === 1 ? 'disabled' : ''}`}
                  onClick={() => currentTablePage > 1 && paginateTable(currentTablePage - 1)}
                  disabled={currentTablePage === 1}
                >
                  Prev
                </button>
                <span className="page-info">{currentTablePage} of {totalTablePages}</span>
                <button 
                  className={`pagination-btn ${currentTablePage === totalTablePages ? 'disabled' : ''}`}
                  onClick={() => currentTablePage < totalTablePages && paginateTable(currentTablePage + 1)}
                  disabled={currentTablePage === totalTablePages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TaskList;
