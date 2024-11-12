// routes/chatbotRoutes.js

import express from "express";
import { getChatResponse } from "../controllers/chatbotController.js";

const router = express.Router();

// POST route for chat
router.post("/", getChatResponse);

export default router;
