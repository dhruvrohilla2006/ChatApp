import express from "express";
import {
  login,
  logout,
  signup,
  updateProfile,
  checkAuth
} from "../controller/auth.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";
import { uploadImage } from "../libs/imageupload.js";

const Router = express.Router();
const authRoute = Router;

authRoute.post("/signup", signup);

authRoute.post("/login", login);

authRoute.post("/logout", logout);

authRoute.put(
  "/update-profile",
  protectedRoute,
  uploadImage,
  updateProfile
);

authRoute.get("/check", protectedRoute, checkAuth)

export default authRoute;
