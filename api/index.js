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

// Health endpoint (must be FIRST, completely synchronous)
app.get("/api/health", (req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

// Root route handler
app.get("/", (req, res) => {
  res.json({
    message: "RR Nagar Backend API",
    version: "1.0.5",
    status: "running",
    buildDate: "2026-01-12T12:35:00Z",
    deployment: "Package-lock.json regenerated - lazy route loading",
    commit: "0f857638",
    routesStatus: "Routes loaded with lazy loading (serverless compatible)",
    endpoints: {
      health: "/api/health",
      categories: "/api/categories",
      products: "/api/products",
      docs: "See API documentation for available endpoints"
    }
  });
});

// Load routes and passport - use lazy loading for serverless compatibility
let routesPromise = null;
let passportPromise = null;
let routesLoaded = false;
let passportLoaded = false;

// Lazy load routes on first request
async function loadRoutes() {
  if (routesLoaded) return;
  if (routesPromise) return routesPromise;
  
  routesPromise = (async () => {
    try {
      const routesModule = await import("../backend/routes/index.js");
      const routes = routesModule.default;
      app.use("/api", routes);
      routesLoaded = true;
      console.log("✅ Routes loaded successfully");
    } catch (err) {
      console.error("❌ Error loading routes:", err.message || err);
      console.error("❌ Error stack:", err.stack);
      // Fallback route
      app.use("/api", (req, res) => {
        res.status(503).json({ 
          error: "Service temporarily unavailable",
          message: "Routes failed to load. Check environment variables and database configuration.",
          detail: process.env.NODE_ENV === "development" ? (err.message || String(err)) : undefined
        });
      });
    }
  })();
  
  return routesPromise;
}

// Lazy load passport on first request
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
      console.log("✅ Passport loaded successfully");
    } catch (err) {
      console.error("❌ Error loading passport:", err.message || err);
      // Continue without passport if it fails
    }
  })();
  
  return passportPromise;
}

// Middleware to ensure routes and passport are loaded before handling requests
// Skip for health check and root
app.use(async (req, res, next) => {
  // Skip route loading for health check and root
  if (req.path === "/api/health" || req.path === "/health" || req.path === "/") {
    return next();
  }
  
  try {
    // Load passport first (needed for OAuth routes) - with timeout
    if (!passportLoaded) {
      await Promise.race([
        loadPassport(),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Passport load timeout")), 5000))
      ]).catch(err => {
        console.error("Passport load error/timeout:", err.message);
      });
    }
    // Then load routes - with timeout
    if (!routesLoaded) {
      await Promise.race([
        loadRoutes(),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Routes load timeout")), 5000))
      ]).catch(err => {
        console.error("Routes load error/timeout:", err.message);
      });
    }
    next();
  } catch (error) {
    console.error("Error in route loading middleware:", error);
    // Return error response instead of crashing
    if (!res.headersSent) {
      res.status(500).json({
        error: "Internal server error",
        message: "Failed to load routes"
      });
    }
  }
});

// Pre-load routes and passport (non-blocking, with timeout) - wrapped in try-catch
try {
  Promise.race([
    loadRoutes(),
    new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 3000))
  ]).catch(err => {
    if (err.message !== "Timeout") {
      console.error("Pre-load routes error:", err.message || err);
    }
  });
  Promise.race([
    loadPassport(),
    new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 3000))
  ]).catch(err => {
    if (err.message !== "Timeout") {
      console.error("Pre-load passport error:", err.message || err);
    }
  });
} catch (error) {
  console.error("Error pre-loading modules:", error.message || error);
}

// Catch-all for unhandled routes (must come before error handler)
// Only catch if routes are loaded and no response sent
app.use((req, res) => {
  if (!res.headersSent && routesLoaded) {
    res.status(404).json({
      error: "Not found",
      path: req.path
    });
  }
});

// Error handling middleware (must be last)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  if (!res.headersSent) {
    res.status(err.status || 500).json({
      error: "Internal server error",
      message: process.env.NODE_ENV === "development" ? err.message : "An error occurred"
    });
  }
});

// Export serverless handler for Vercel/AWS Lambda
const handler = serverless(app);
export default handler;

// Start server for non-serverless platforms (Cloud Run, Render, etc.)
if (process.env.VERCEL !== "1") {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`Backend listening on http://localhost:${PORT}`);
  });
}
