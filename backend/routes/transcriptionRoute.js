import express from "express";
import { processAudioChunks } from "../controllers/transcriptionController.js";

const router = express.Router();

router.post("/transcribe", processAudioChunks);

export default router;
