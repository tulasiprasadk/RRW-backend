import "dotenv/config";
import express from "express";
import cors from "cors";
import session from "express-session";

import routes from "../backend/routes/index.js";
import passportModule from "../backend/passport.js";
import passport from "passport";

// Create app
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

app.use(express.json());

// Sessions
app.use(
  session({
    name: "rrnagar.sid",
    secret: process.env.SESSION_SECRET || "fallback-secret-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,        // required on Vercel (HTTPS)
      httpOnly: true,
      sameSite: "none",    // required for cross-site cookies
    },
  })
);

// Initialize passport (passport.js exports the configured passport instance)
const passportInstance = passportModule.default || passportModule;
app.use(passportInstance.initialize());
app.use(passportInstance.session());

// Health endpoint
app.get("/api/health", (req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "RR Nagar Backend API",
    version: "1.0.6",
    status: "running",
  });
});

// Routes
app.use("/api", routes);

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

// 🔑 THIS is what Vercel needs
export default app;
