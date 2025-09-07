import express from "express";
import {
  checkAuth,
  login,
  signup,
  updateProfile,
} from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const userRouter = express.Router();

userRouter.post("/signUp", signup);
userRouter.post("/login", login);
userRouter.put("/update-profile", protectRoute, updateProfile);
userRouter.put("/check-auth", protectRoute, checkAuth);

export default userRouter;
