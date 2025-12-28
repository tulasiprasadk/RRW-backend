
import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import session from "express-session";

import routes from "../routes/index.js";
import "../config/database.js";
import passport from "../passport.js";

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://www.rrnagar.com",
      "https://rrnagar.com"
    ],
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      sameSite: "none",
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api", routes);

// Vercel handler export
export { app };
export default function handler(req, res) {
  return app(req, res);
}
