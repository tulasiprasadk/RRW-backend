import axios from "axios";

// Use proxy in development (localhost), direct URL in production
const baseURL = import.meta.env.DEV 
  ? "" // Vite proxy handles /api requests
  : "https://your-backend-url.com"; // Replace with your production backend URL

axios.defaults.baseURL = baseURL;
axios.defaults.withCredentials = true;

export default axios;
