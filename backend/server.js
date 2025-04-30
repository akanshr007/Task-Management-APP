const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

// Import DB connection
const connectDB = require('./src/config/db');

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Import routes
const taskRoutes = require('./src/routes/taskRoutes');

// Route middleware
app.use('/api/tasks', taskRoutes);

// Welcome route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Task Management API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Connect to database and start server
const PORT = process.env.PORT || 5000;

// Connect to in-memory database
connectDB()
  .then(() => {
    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start server', err);
  }); 