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

// Root route handler
app.get("/", (req, res) => {
  res.json({
    message: "RR Nagar Backend API",
    version: "1.0.4",
    status: "running",
    buildDate: "2026-01-12T12:15:00Z",
    deployment: "Routes fixed - top-level await implementation",
    commit: "00a76b3a",
    routesStatus: "Routes loaded with top-level await",
    endpoints: {
      health: "/api/health",
      categories: "/api/categories",
      products: "/api/products",
      docs: "See API documentation for available endpoints"
    }
  });
});

// Health endpoint
app.get("/api/health", (req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

// Load routes and passport - use top-level await for serverless compatibility
let routesLoaded = false;
let passportLoaded = false;

// Load routes synchronously at module level using top-level await
try {
  // Import routes
  const routesModule = await import("../routes/index.js");
  const routes = routesModule.default;
  app.use("/api", routes);
  routesLoaded = true;
  console.log("✅ Routes loaded successfully");
} catch (err) {
  console.error("❌ Error loading routes:", err.message || err);
  // Fallback route
  app.use("/api", (req, res) => {
    res.status(503).json({ 
      error: "Service temporarily unavailable",
      message: "Routes failed to load. Please check environment variables and database configuration.",
      detail: process.env.NODE_ENV === "development" ? (err.message || String(err)) : undefined
    });
  });
}

try {
  // Import passport
  const passportModule = await import("../passport.js");
  const passport = passportModule.default;
  app.use(passport.initialize());
  app.use(passport.session());
  passportLoaded = true;
  console.log("✅ Passport loaded successfully");
} catch (err) {
  console.error("❌ Error loading passport:", err.message || err);
  // Continue without passport if it fails
}

// Export serverless handler for Vercel/AWS Lambda
export const handler = serverless(app);

// Start server for non-serverless platforms (Cloud Run, Render, etc.)
if (process.env.VERCEL !== "1") {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`Backend listening on http://localhost:${PORT}`);
  });
}
