import express from "express";
import { createGroup, joinGroup, leaveGroup, getGroups, searchGroups, getGroupByID } from "../controllers/group.controller.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// GET all groups
router.get("/", getGroups);

// SEARCH groups
router.get("/search", searchGroups);

// GET group by ID
router.get("/getGroup/:id", getGroupByID);

// CREATE group (verifyToken applied once, correctly)
router.post("/create", verifyToken, createGroup);

// JOIN group
router.post("/:groupId/join", joinGroup);

// LEAVE group
router.post("/:groupId/leave", leaveGroup);

export default router;