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

const postRouter = express.Router();

// postRouter.post("/posts", authentication, postCreateValidation, createPost);
postRouter.post("/posts", createPost);

postRouter.get("/posts", postCreateValidation, getAllPost);

postRouter.get("/posts/:id", getSinglePost);

postRouter.delete("/posts/:id", authentication, removePost);

postRouter.patch("/posts/:id", authentication, updatePost);

export default postRouter;
