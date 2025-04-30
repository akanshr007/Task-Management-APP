# Task Management API

Backend API for the Task Management application, which provides endpoints for managing tasks.

## Usage

Rename ".env.example" to ".env" and update the values to your own.

## Install Dependencies

```
npm install
```

## Run App

```
# Run in development mode
npm run dev

# Run in production mode
npm start
```

## API Endpoints

### Tasks

```
GET    /api/tasks         - Get all tasks
POST   /api/tasks         - Create a new task
GET    /api/tasks/:id     - Get single task
PUT    /api/tasks/:id     - Update task
DELETE /api/tasks/:id     - Delete task
```

## Frontend Integration
The frontend React app can connect to this API by configuring the appropriate base URL in the API service. 