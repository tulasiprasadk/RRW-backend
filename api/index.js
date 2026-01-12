import "dotenv/config";
import express from "express";
import serverless from "serverless-http";
import cors from "cors";
import bodyParser from "body-parser";
import session from "express-session";

// Create app
const app = express();

// CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://rrw-frontend.vercel.app",
      "https://rrnagarfinal-frontend.vercel.app"
    ],
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "fallback-secret-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
    },
  })
);

// Health endpoint - MUST be synchronous, no async operations
app.get("/api/health", (req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

// Root route handler
app.get("/", (req, res) => {
  res.json({
    message: "RR Nagar Backend API",
    version: "1.0.6",
    status: "running"
  });
});

// Lazy loading state
let routesLoaded = false;
let passportLoaded = false;
let routesPromise = null;
let passportPromise = null;

// Load passport (non-blocking)
async function loadPassport() {
  if (passportLoaded) return;
  if (passportPromise) return passportPromise;
  
  passportPromise = (async () => {
    try {
      const passportModule = await import("../backend/passport.js");
      const passport = passportModule.default;
      app.use(passport.initialize());
      app.use(passport.session());
      passportLoaded = true;
      console.log("✅ Passport loaded");
    } catch (err) {
      console.error("❌ Passport load error:", err.message);
    }
  })();
  
  return passportPromise;
}

// Load routes (non-blocking)
async function loadRoutes() {
  if (routesLoaded) return;
  if (routesPromise) return routesPromise;
  
  routesPromise = (async () => {
    try {
      const routesModule = await import("../backend/routes/index.js");
      const routes = routesModule.default;
      app.use("/api", routes);
      routesLoaded = true;
      console.log("✅ Routes loaded");
    } catch (err) {
      console.error("❌ Routes load error:", err.message);
      // Fallback
      app.use("/api", (req, res) => {
        res.status(503).json({ 
          error: "Service unavailable",
          message: "Routes failed to load"
        });
      });
    }
  })();
  
  return routesPromise;
}

// Middleware - load routes/passport on demand (non-blocking)
app.use(async (req, res, next) => {
  // Skip for health and root
  if (req.path === "/api/health" || req.path === "/") {
    return next();
  }
  
  // Load passport and routes in parallel, don't wait
  if (!passportLoaded) {
    loadPassport().catch(() => {});
  }
  if (!routesLoaded) {
    loadRoutes().catch(() => {});
  }
  
  // Wait briefly for routes to load (with timeout)
  if (!routesLoaded) {
    try {
      await Promise.race([
        loadRoutes(),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 2000))
      ]);
    } catch (err) {
      // Continue even if timeout
    }
  }
  
  next();
});

// Error handler
app.use((err, req, res, next) => {
  if (!res.headersSent) {
    res.status(err.status || 500).json({
      error: "Internal server error",
      message: process.env.NODE_ENV === "development" ? err.message : "An error occurred"
    });
  }
});

// 404 handler
app.use((req, res) => {
  if (!res.headersSent) {
    res.status(404).json({
      error: "Not found",
      path: req.path
    });
  }
});

// Export serverless handler
const handler = serverless(app);
export default handler;
