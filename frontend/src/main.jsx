// frontend/src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import axios from "axios";

// API base URL
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";
axios.defaults.baseURL = apiUrl;
axios.defaults.withCredentials = true;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* 👇 basename REQUIRED for GitHub Pages */}
    <BrowserRouter basename="/rrnagar-coming-soon">
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
