import "dotenv/config";
import express from "express";
import cors from "cors";
import session from "express-session";

// Static imports - load everything synchronously
import passport from "../backend/passport.js";
import routes from "../backend/routes/index.js";

// Create Express app
const app = express();

// Trust proxy (required on Vercel)
app.set("trust proxy", 1);

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Body parser
app.use(express.json());

// Session
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

// Initialize passport
const passportInstance = passport.default || passport;
app.use(passportInstance.initialize());
app.use(passportInstance.session());

// Health endpoints
app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "RR Nagar Backend API",
    version: "1.0.23",
    status: "running",
  });
});

// Mount routes at /api
const routesHandler = routes.default || routes;
app.use("/api", routesHandler);

// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not found", path: req.path });
});

// Export for Vercel
export default app;
