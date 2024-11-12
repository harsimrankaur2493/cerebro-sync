import express from "express";
import userRoutes from "./userRoutes.js"
import taskRoutes from "./taskRoutes.js";
import chatbotRoutes from "./chatbotRoutes.js"


const router = express.Router();

router.use("/user" , userRoutes);//api/user/login
router.use("/tasks" , taskRoutes);
router.use("/chat" ,chatbotRoutes )


export default router;