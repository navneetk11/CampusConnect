import express from "express";
import { getCourseInfo } from "../controllers/course.controller.js";

const router = express.Router();

router.get("/courseInfo/:id", getCourseInfo);

export default router