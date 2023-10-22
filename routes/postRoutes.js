import express from 'express'
import {
  createPost,
  getAllPost,
  getSinglePost,
  removePost,
  updatePost,
  getPost,
  likePost,
  unLikePost,
} from '../controllers/PostController.js'
import { postCreateValidation } from '../validations/validation.js'
import authentication from '../validations/authentication.js'
import validationErrors from '../validations/validationErrors.js'

const postRouter = express.Router()

postRouter.post('/posts', postCreateValidation, validationErrors, createPost)
// postRouter.post("/posts", authentication, postCreateValidation, validationErrors, createPost);

postRouter.get('/posts', getAllPost)

postRouter.get('/posts/:id', getPost)

postRouter.put('/posts/:id', getSinglePost)

postRouter.delete('/posts/:id', removePost)

postRouter.put('/likePost/:postId/', authentication, likePost)
postRouter.delete('/unlikePost/:postId/', authentication, unLikePost)

postRouter.patch(
  '/posts/:id',
  authentication,
  postCreateValidation,
  validationErrors,
  updatePost
)

export default postRouter
