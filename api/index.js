import "dotenv/config";
import express from "express";
import serverless from "serverless-http";
import cors from "cors";
import bodyParser from "body-parser";
import session from "express-session";

import routes from "../routes/index.js";
import "../config/database.js"; // ensure DB connection
import passport from "../passport.js";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://rrw-frontend.vercel.app"
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
app.use(passport.initialize());
app.use(passport.session());

// Root route handler
app.get("/", (req, res) => {
  res.json({
    message: "RR Nagar Backend API",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      docs: "See API documentation for available endpoints"
    }
  });
});

app.use("/api", routes);

// Export serverless handler for Vercel/AWS Lambda
export const handler = serverless(app);

// Start server for non-serverless platforms (Cloud Run, Render, etc.)
if (process.env.VERCEL !== "1") {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`Backend listening on http://localhost:${PORT}`);
  });
}