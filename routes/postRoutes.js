import express from "express";
import {
	createPost,
	getAllPost,
	getSinglePost,
	removePost,
	updatePost,
} from "../controllers/PostController.js";
import { postCreateValidation } from "../validations/validation.js";
import authentication from "../validations/authentication.js";
import validationErrors from "../validations/validationErrors.js";

const postRouter = express.Router();

postRouter.post("/posts", authentication, postCreateValidation, validationErrors, createPost);
// postRouter.post("/posts", authentication, postCreateValidation, validationErrors, createPost);

postRouter.get("/posts", getAllPost);

postRouter.get("/posts/:id", getSinglePost);

postRouter.delete("/posts/:id", authentication, removePost);

postRouter.patch("/posts/:id", authentication, postCreateValidation, validationErrors, updatePost);

export default postRouter;
