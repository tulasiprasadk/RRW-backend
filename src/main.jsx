import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import axios from "axios";

// Detect environment
const isDev = import.meta.env.DEV;

// API base URL
// - Dev: use Vite proxy (/api → localhost backend)
// - Prod: use Render backend URL
axios.defaults.baseURL = isDev
  ? ""
  : import.meta.env.VITE_API_URL;

axios.defaults.withCredentials = true;

// Router base (GitHub Pages / future custom domain)
const baseName = import.meta.env.VITE_BASE_URL || "/";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter basename={baseName}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
