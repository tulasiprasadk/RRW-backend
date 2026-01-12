import express from "express";
import passportConfig from "../passport.js";
import passport from "passport";

const router = express.Router();

/* ============================================================
   GOOGLE OAUTH — CUSTOMER
   GET /api/customers/auth/google
============================================================ */
router.get(
  "/auth/google",
  (req, res, next) => {
    const passportInstance = passportConfig.default || passportConfig;
    passportInstance.authenticate("google-customer", {
      scope: ["profile", "email"],
    })(req, res, next);
  }
);

/* ============================================================
   GOOGLE OAUTH CALLBACK — CUSTOMER
   GET /api/customers/auth/google/callback
============================================================ */
router.get(
  "/auth/google/callback",
  (req, res, next) => {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const passportInstance = passportConfig.default || passportConfig;
    
    passportInstance.authenticate("google-customer", {
      failureRedirect: `${frontendUrl}/login?error=google_failed`,
      session: true,
    })(req, res, (err) => {
      if (err) {
        console.error("Google OAuth callback error:", err);
        return res.redirect(`${frontendUrl}/login?error=google_failed`);
      }
      
      if (!req.user) {
        console.error("No user after Google OAuth");
        return res.redirect(`${frontendUrl}/login?error=google_failed`);
      }
      
      // Save customer in session
      req.session.customerId = req.user.id;
      
      // Redirect to dashboard
      return res.redirect(`${frontendUrl}/dashboard`);
    });
  }
);

export default router;
