import { Router } from "express";
import rateLimit from "express-rate-limit";
import { register, login } from "../controllers/authController.js";
import { authenticateUser, requireAdmin, } from "../middleware/authMiddleware.js";

const router = Router();

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        message: "Too many attempts. Please try again later.",
    },
});

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);

router.get("/me", authenticateUser, (req, res) => {
  res.status(200).json({
    user: req.user,
  });
});

// Temporary route to test admin permissions
router.get(
  "/admin-check",
  authenticateUser,
  requireAdmin,
  (req, res) => {
    res.status(200).json({
      message: "Admin access granted",
    });
  }
);

export default router;
