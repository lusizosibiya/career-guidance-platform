import { Router } from "express";

import {
    getRequirements,
    replaceRequirements,
} from "../controllers/requirementsController.js";

import {
    authenticateUser,
    requireAdmin,
} from "../middleware/authMiddleware.js";

const router = Router({ mergeParams: true });

router.get("/", getRequirements);

router.put(
    "/",
    authenticateUser,
    requireAdmin,
    replaceRequirements
);

export default router;