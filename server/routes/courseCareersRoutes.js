import { Router } from "express";
import {
    getCourseCareers,
    replaceCourseCareers,
} from "../controllers/courseCareersController.js";
import {
    authenticateUser,
    requireAdmin,
} from "../middleware/authMiddleware.js";

const router = Router({ mergeParams: true });

router.get("/", getCourseCareers);

router.put(
    "/",
    authenticateUser,
    requireAdmin,
    replaceCourseCareers
);

export default router;