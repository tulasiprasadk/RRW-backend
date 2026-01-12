import "dotenv/config";
import express from "express";
import cors from "cors";
import session from "express-session";

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

// Root route - must be before /api routes (no dependencies)
app.get("/", (req, res) => {
  res.json({
    message: "RR Nagar Backend API",
    version: "1.0.11",
    status: "running",
  });
});

// Health endpoint (no dependencies)
app.get("/api/health", (req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

// Lazy load passport and routes to prevent crashes on import
let passportInitialized = false;
let routesInitialized = false;
let passportModule = null;
let routesModule = null;

// Middleware to lazy-load passport and routes on first request
app.use(async (req, res, next) => {
  // Skip lazy loading for health and root endpoints
  if (req.path === "/" || req.path === "/api/health") {
    return next();
  }

  // Initialize passport on first request
  if (!passportInitialized) {
    try {
      passportModule = await import("../backend/passport.js");
      const passport = passportModule.default || passportModule;
      app.use(passport.initialize());
      app.use(passport.session());
      passportInitialized = true;
    } catch (err) {
      console.error("Error loading passport:", err.message || err);
      // Continue without passport
    }
  }

  // Initialize routes on first request
  if (!routesInitialized) {
    try {
      routesModule = await import("../backend/routes/index.js");
      const routes = routesModule.default || routesModule;
      app.use("/api", routes);
      routesInitialized = true;
    } catch (err) {
      console.error("Error loading routes:", err.message || err);
      // Continue without routes
    }
  }

  next();
});

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
