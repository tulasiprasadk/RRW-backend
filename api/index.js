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

// Fast health endpoints (must be before session/routes)
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
    version: "1.0.20",
    status: "running",
  });
});

// Session store - use MemoryStore for Vercel (Postgres session store can be added later if needed)
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

// Deferred route mounting - load routes asynchronously to avoid blocking startup
let routesMounted = false;
let routesPromise = null;

async function mountRoutes() {
  if (routesMounted) return;
  if (routesPromise) return routesPromise;

  routesPromise = (async () => {
    try {
      // Import passport and initialize
      const passportModule = await import("../backend/passport.js");
      const passport = passportModule.default || passportModule;
      app.use(passport.initialize());
      app.use(passport.session());

      // Import and mount routes
      const routesModule = await import("../backend/routes/index.js");
      const routes = routesModule.default || routesModule;
      app.use("/api", routes);
      routesMounted = true;
      console.log("Routes mounted successfully");
    } catch (e) {
      console.error("Failed to mount routes:", e.message || e);
      // App can still serve health endpoints
    }
  })();

  return routesPromise;
}

// Middleware to ensure routes are mounted before handling API requests
app.use(async (req, res, next) => {
  // Skip route mounting for health endpoints
  if (req.path === "/" || req.path === "/health" || req.path === "/api/health") {
    return next();
  }

  // Ensure routes are mounted
  await mountRoutes();
  next();
});

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

// Export Express app for Vercel (no serverless-http needed)
export default app;
