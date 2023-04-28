
import { removeComment, postComment, getAllComments } from "../controllers/CommentController.js";
import authentication from "../validations/authentication.js";

import express from 'express'

const commentRouter = express.Router()

commentRouter.post("/posts/:id/comments", postComment);

commentRouter.get("/posts/:id/comments", getAllComments);

commentRouter.delete("/posts/:id/comments/:id", authentication, removeComment);


// commentRouter.get("/posts/comments", );
export default commentRouter;
