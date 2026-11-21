import { Router } from "express";

import {
    getInstitutions,
    createInstitution,
    updateInstitution,
    deleteInstitution,
} from "../controllers/institutionController.js";

import {
    authenticateUser,
    requireAdmin,
} from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", getInstitutions);

router.post(
    "/",
    authenticateUser,
    requireAdmin,
    createInstitution
);

router.put(
    "/:id",
    authenticateUser,
    requireAdmin,
    updateInstitution
);

router.delete(
    "/:id",
    authenticateUser,
    requireAdmin,
    deleteInstitution
);

export default router;