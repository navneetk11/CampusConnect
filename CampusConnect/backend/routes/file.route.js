import express from "express";
import upload from "../middleware/upload.js";
import { fileUpload, fileDownload, fileDelete } from "../controllers/file.controller.js";
const router = express.Router();

//Add filesharing functions here
router.post("/upload", upload.single("file"), fileUpload);
router.get("/download/:fileId", fileDownload);
router.delete("/delete/:fileId", fileDelete);

export default router;