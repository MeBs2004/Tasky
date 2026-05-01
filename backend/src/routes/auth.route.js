const { Router } = require("express");
const passport = require("passport");
const { config } = require("../config/app.config");
const {
  googleLoginCallback,
  loginController,
  logOutController,
  registerUserController,
} = require("../controllers/auth.controller");

const failedUrl = `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`;
const authRoutes = Router();

authRoutes.post("/register", registerUserController);
authRoutes.post("/login", loginController);
authRoutes.post("/logout", logOutController);

authRoutes.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
    session: false,
  }),
);

authRoutes.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: failedUrl,
    session: false,
  }),
  googleLoginCallback,
);

module.exports = authRoutes;
