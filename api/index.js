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
    version: "1.0.0",
    status: "running",
    endpoints: {
      health: "/api/health",
      docs: "See API documentation for available endpoints"
    }
  });
});

// Health endpoint
app.get("/api/health", (req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

// Load routes and passport - use synchronous imports with error handling
try {
  // Import routes
  import("../routes/index.js")
    .then((routesModule) => {
      const routes = routesModule.default;
      app.use("/api", routes);
      console.log("✅ Routes loaded successfully");
    })
    .catch((err) => {
      console.error("❌ Error loading routes:", err.message || err);
      // Fallback route
      app.use("/api", (req, res) => {
        res.status(503).json({ 
          error: "Service temporarily unavailable",
          message: "Routes failed to load. Please check environment variables and database configuration.",
          detail: process.env.NODE_ENV === "development" ? (err.message || String(err)) : undefined
        });
      });
    });

  // Import passport
  import("../passport.js")
    .then((passportModule) => {
      const passport = passportModule.default;
      app.use(passport.initialize());
      app.use(passport.session());
      console.log("✅ Passport loaded successfully");
    })
    .catch((err) => {
      console.error("❌ Error loading passport:", err.message || err);
      // Continue without passport if it fails
    });
} catch (error) {
  console.error("❌ Error during import setup:", error.message || error);
  
  // Fallback route
  app.use("/api", (req, res) => {
    res.status(503).json({ 
      error: "Service temporarily unavailable",
      message: "Failed to initialize routes. Please check server logs.",
      detail: process.env.NODE_ENV === "development" ? (error.message || String(error)) : undefined
    });
  });
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
