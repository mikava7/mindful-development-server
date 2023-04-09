import express from "express";
import { registerUser, loginUser } from "../controllers/UserController.js";
import { registerValidator, loginValidator } from "../validations/validation.js";
import validationErrors from "../validations/validationErrors.js";
import authentication from "../validations/authentication.js";
const userRouter = express.Router();

userRouter.post("/register", registerValidator, authentication, validationErrors, registerUser);
userRouter.post("/login", loginValidator, authentication, validationErrors, loginUser);

export default userRouter;