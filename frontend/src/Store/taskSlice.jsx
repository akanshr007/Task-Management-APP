import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = 'http://localhost:5000/api/tasks';

// Async thunks
export const fetchTasks = createAsyncThunk(
    "tasks/fetchTasks",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(API_URL);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || "Failed to fetch tasks");
        }
    }
);

export const addTask = createAsyncThunk(
    "tasks/addTask",
    async (text, { rejectWithValue }) => {
        try {
            const response = await axios.post(API_URL, { text });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || "Failed to add task");
        }
    }
);

export const removeTask = createAsyncThunk(
    "tasks/removeTask",
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || "Failed to delete task");
        }
    }
);

export const toggleTaskCompletion = createAsyncThunk(
    "tasks/toggleCompletion",
    async ({id, completed}, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API_URL}/${id}`, { completed });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || "Failed to update task");
        }
    }
);

const initialState = {
    tasks: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
};

const taskSlice = createSlice({
    name: "tasks",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch tasks
            .addCase(fetchTasks.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.tasks = action.payload;
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // Add task
            .addCase(addTask.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(addTask.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.tasks.unshift(action.payload);
            })
            .addCase(addTask.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // Remove task
            .addCase(removeTask.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(removeTask.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.tasks = state.tasks.filter((task) => task._id !== action.payload);
            })
            .addCase(removeTask.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // Toggle task completion
            .addCase(toggleTaskCompletion.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(toggleTaskCompletion.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const index = state.tasks.findIndex(task => task._id === action.payload._id);
                if (index !== -1) {
                    state.tasks[index] = action.payload;
                }
            })
            .addCase(toggleTaskCompletion.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    }
});

export default taskSlice.reducer;