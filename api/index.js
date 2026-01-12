import "dotenv/config";
import express from "express";
import cors from "cors";
import session from "express-session";

// Static imports - use regular import statements (not await import)
// Wrap in try-catch at module level is not possible, so we'll handle errors during initialization
import passportInstance from "../backend/passport.js";
import routes from "../backend/routes/index.js";

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

// Initialize passport BEFORE routes
try {
  const passport = passportInstance.default || passportInstance;
  app.use(passport.initialize());
  app.use(passport.session());
} catch (err) {
  console.error("Error initializing passport:", err.message || err);
}

// Root route - guaranteed safe endpoint
app.get("/", (req, res) => {
  res.json({
    message: "RR Nagar Backend API",
    version: "1.0.18",
    status: "running",
  });
});

// Health endpoint - guaranteed safe endpoint
app.get("/api/health", (req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

// Mount routes at /api
try {
  const routesHandler = routes.default || routes;
  app.use("/api", routesHandler);
} catch (err) {
  console.error("Error mounting routes:", err.message || err);
}

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

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Not found",
    path: req.path,
  });
});

// Export Express app for Vercel
export default app;
