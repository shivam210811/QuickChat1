import express from "express";
import { checkAuth, login, Signup, updateProfile } from "../controllers/userController.js";
import {protectRoute} from "../Middleware/auth.js"
const userRouter = express.Router();


userRouter.post("/Signup", Signup);
userRouter.post("/login", login);
userRouter.put("/update-profile", protectRoute, updateProfile);
userRouter.get("/check", protectRoute, checkAuth);

export default userRouter;