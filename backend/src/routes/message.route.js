import { Router } from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import {
  getUserForSidebar,
  sendMessage,
} from "../controller/message.controller.js";
import { getMessages } from "../controller/message.controller.js";
import { uploadImage } from "../libs/imageupload.js";
const messageRoute = Router();

messageRoute.get("/user", protectedRoute, getUserForSidebar);
messageRoute.get("/:id", protectedRoute, getMessages);
messageRoute.post("/send/:id", protectedRoute, uploadImage, sendMessage);

export default messageRoute;
