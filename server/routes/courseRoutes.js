import { Router } from "express";
import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/courseController.js";
import {
  authenticateUser,
  requireAdmin,
} from "../middleware/authMiddleware.js";
import requirementsRoutes from "./requirementsRoutes.js";
import courseCareersRoutes from "./courseCareersRoutes.js";

const router = Router();

router.get("/", getAllCourses);
router.use("/:courseId/requirements", requirementsRoutes);
router.use("/:courseId/careers", courseCareersRoutes);
router.get("/:id", getCourseById);
router.post("/", authenticateUser, requireAdmin, createCourse);
router.put("/:id", authenticateUser, requireAdmin, updateCourse);
router.delete("/:id", authenticateUser, requireAdmin, deleteCourse);

export default router;
