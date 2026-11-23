import express from "express";
import { matchCourses } from "../controllers/matchingController.js";

const router = express.Router();

router.post("/", matchCourses);

export default router;
