import express from "express";
import { addCourse, addUser, deleteCourse, deleteUser, editYear, getUserbyId, getUsers, loginUser, updateUserPass } from "../controllers/user.controller.js";
const router = express.Router();

//function signatures used for interacting with the MongoDB database
router.get("/:id", getUserbyId);
router.post("/", addUser);       // signup
router.post("/login", loginUser); // login
router.delete("/:id", deleteUser);
router.get("/", getUsers);
router.post("/update/:id", updateUserPass); // Update username or password
router.post("/AddCourse/:id", addCourse);   // Add course to user profile
router.post("/EditYear/:id", editYear);     // Edit user's year
router.delete("/deleteCourse/:id", deleteCourse);
export default router;
