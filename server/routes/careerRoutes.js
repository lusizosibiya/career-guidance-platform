import { Router } from "express";
import {
    getCareers,
    createCareer,
} from "../controllers/careerController.js";
import {
    authenticateUser,
    requireAdmin,
} from "../middleware/authMiddleware.js";

const router = Router();

// Public read access
router.get("/", getCareers);

// Admin-only creation
router.post(
    "/",
    authenticateUser,
    requireAdmin,
    createCareer
);

export default router;