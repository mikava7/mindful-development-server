import express from "express";
import { registerUser, loginUser, getUserInfo } from "../controllers/UserController.js";
import { registerValidator, loginValidator } from "../validations/validation.js";
import validationErrors from "../validations/validationErrors.js";
import authentication from "../validations/authentication.js";
const userRouter = express.Router();

userRouter.post("/auth/register", registerValidator, validationErrors, registerUser);
userRouter.post("/auth/login", loginValidator, validationErrors, loginUser);
userRouter.get("/auth/user-info", authentication, getUserInfo);

export default userRouter;
