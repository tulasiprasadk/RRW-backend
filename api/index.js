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

// Load routes and passport with error handling
(async () => {
  try {
    // Import routes
    const routesModule = await import("../routes/index.js");
    const routes = routesModule.default;
    
    // Import passport
    const passportModule = await import("../passport.js");
    const passport = passportModule.default;
    
    // Initialize passport
    app.use(passport.initialize());
    app.use(passport.session());
    
    // Mount routes
    app.use("/api", routes);
    
    console.log("✅ Routes and passport loaded successfully");
  } catch (error) {
    console.error("❌ Error loading routes/passport:", error.message || error);
    
    // Fallback routes
    app.use("/api", (req, res) => {
      res.status(503).json({ 
        error: "Service temporarily unavailable",
        message: "Routes failed to load. Please check environment variables and database configuration.",
        detail: process.env.NODE_ENV === "development" ? (error.message || String(error)) : undefined
      });
    });
  }
})();

// Export serverless handler for Vercel/AWS Lambda
export const handler = serverless(app);

// Start server for non-serverless platforms (Cloud Run, Render, etc.)
if (process.env.VERCEL !== "1") {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`Backend listening on http://localhost:${PORT}`);
  });
}
