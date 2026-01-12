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
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Body parser
app.use(express.json());

// Session store
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

// Health endpoints (must be before routes)
app.get("/api/health", (req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV || "development" });
});

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "RR Nagar Backend API",
    version: "1.0.22",
    status: "running",
  });
});

// Initialize passport and routes - static imports with error handling
// Use IIFE to handle async imports without top-level await
(async () => {
  try {
    const passportModule = await import("../backend/passport.js");
    const passport = passportModule.default || passportModule;
    app.use(passport.initialize());
    app.use(passport.session());
    console.log("Passport initialized");
  } catch (err) {
    console.error("Error initializing passport:", err.message || err);
  }

  try {
    const routesModule = await import("../backend/routes/index.js");
    const routes = routesModule.default || routesModule;
    app.use("/api", routes);
    console.log("Routes mounted successfully");
  } catch (err) {
    console.error("Error mounting routes:", err.message || err);
  }
})();

// Error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  if (!res.headersSent) {
    res.status(500).json({
      error: "Internal server error",
      message: err.message || "Unknown error",
    });
  }
});

// 404 handler (must be last)
app.use((req, res) => {
  res.status(404).json({
    error: "Not found",
    path: req.path,
  });
});

// Export Express app for Vercel
export default app;
