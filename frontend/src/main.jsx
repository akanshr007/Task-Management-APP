// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // Importing App
import "./index.css";    // Optional styling
import { Provider } from "react-redux";
import { store } from "./Store/store";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store ={store}>
  <React.StrictMode>
    <App />
  </React.StrictMode>
  </Provider>
);
