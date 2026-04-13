import express from "express";
import { createSession, getSessionsByGroup, joinSession, leaveSession, findEarliestSession } from "../controllers/session.controller.js";
import Session from "../models/sessions.js";
const router = express.Router();

// POST: create session
router.post("/create", createSession);

// GET: get sessions by group
router.get("/:groupId", getSessionsByGroup);

// GETL get next session by user id
router.get("/:uid/next", findEarliestSession);

// POST: join a session
router.post("/:sessionId/join", joinSession);

// POST: leave a session
router.post("/:sessionId/leave", leaveSession);

//DELETE: Cancel a session
router.delete("/:id", async (req, res) => {
  try {
    const {id} = req.params;
    console.log(id);
    const deleted = await Session.findByIdAndDelete(id);

    if (!deleted) {
      return res.json({ success: false, message: "Session not found" });
    }

    res.json({ success: true, message: "Session cancelled" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error cancelling session" });
  }
});

//POST: Rescheduling a session
router.post("/:id/reschedule", async (req, res) => {
  try {
    const {id} = req.params;
    const { newDate, newTime } = req.body;
    console.log("Date: "+ newDate, "Time:"+newTime);
    const updated = await Session.findByIdAndUpdate(
      id,
      { date: newDate, time: newTime },
      { new: true }
    );

    if (!updated) {
      return res.json({ success: false, message: "Session not found" });
    }

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error rescheduling session" });
  }
});

export default router;
