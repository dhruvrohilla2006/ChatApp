import { Router } from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import { getUserForSidebar } from "../controller/message.controller.js";
import { getMessages } from "../controller/message.controller.js";
import upload from "../libs/multerConfig.mjs";

const messageRoute = Router();

messageRoute.get("/user", protectedRoute, getUserForSidebar);
messageRoute.get("/:id",protectedRoute ,upload.single("post"),getMessages)

export default messageRoute;
