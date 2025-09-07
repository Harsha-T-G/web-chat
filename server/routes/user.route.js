import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  checkAuth,
  login,
  signup,
  updateProfile,
} from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.put("/update-profile", protectRoute, updateProfile);
userRouter.get("/check", protectRoute, checkAuth);

export default userRouter;
