import { Router } from "express";
import { signup, login, logout, me, googleAuth } from "../controllers/auth";
import { requireAuth } from "../middleware/auth";
import passport from "passport";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", requireAuth, me);
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: process.env.FRONTEND_URL as string }),
  googleAuth
);

export default router;
