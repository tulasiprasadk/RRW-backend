import "dotenv/config";
import express from "express";
import cors from "cors";
import session from "express-session";

// IMPORTANT: static imports only (no dynamic import / lazy loading)
import routes from "../backend/routes/index.js";
import passportInstance from "../backend/passport.js";

// Create Express app
const app = express();

// Trust proxy (required on Vercel)
app.set("trust proxy", 1);

// CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://rrw-frontend.vercel.app",
      "https://rrnagarfinal-frontend.vercel.app",
    ],
    credentials: true,
  })
);

// Body parser
app.use(express.json());

// Sessions
app.use(
  session({
    name: "rrnagar.sid",
    secret: process.env.SESSION_SECRET || "fallback-secret-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      httpOnly: true,
      sameSite: "none",
    },
  })
);

// Initialize passport (backend/passport.js exports configured instance)
const passport = passportInstance.default || passportInstance;
app.use(passport.initialize());
app.use(passport.session());

// Root route - must be before /api routes
app.get("/", (req, res) => {
  res.json({
    message: "RR Nagar Backend API",
    version: "1.0.13",
    status: "running",
  });
});

// Health endpoint
app.get("/api/health", (req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

// API routes
const routesHandler = routes.default || routes;
app.use("/api", routesHandler);

// Error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  if (!res.headersSent) {
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Not found",
    path: req.path,
  });
});

// Export Express app for Vercel
export default app;
