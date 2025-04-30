// In-memory task store
let tasks = [];
let idCounter = 1;

// Task model
class Task {
  static async find() {
    return [...tasks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  static async findById(id) {
    return tasks.find(task => task._id === id);
  }

  static async create(taskData) {
    const { text } = taskData;
    
    // Validation
    if (!text) {
      const error = new Error('Task text is required');
      error.name = 'ValidationError';
      error.errors = { text: { message: 'Task text is required' } };
      throw error;
    }
    
    if (text.length > 200) {
      const error = new Error('Task text cannot be more than 200 characters');
      error.name = 'ValidationError';
      error.errors = { text: { message: 'Task text cannot be more than 200 characters' } };
      throw error;
    }
    
    const newTask = {
      _id: String(idCounter++),
      text,
      completed: false,
      createdAt: new Date()
    };
    
    tasks.push(newTask);
    return newTask;
  }

  static async findByIdAndUpdate(id, update) {
    const taskIndex = tasks.findIndex(task => task._id === id);
    
    if (taskIndex === -1) {
      return null;
    }
    
    const updatedTask = {
      ...tasks[taskIndex],
      ...update,
    };
    
    tasks[taskIndex] = updatedTask;
    return updatedTask;
  }

  static async findByIdAndDelete(id) {
    const taskIndex = tasks.findIndex(task => task._id === id);
    
    if (taskIndex === -1) {
      return null;
    }
    
    const deletedTask = tasks[taskIndex];
    tasks = tasks.filter(task => task._id !== id);
    
    return deletedTask;
  }
}

module.exports = Task; 



