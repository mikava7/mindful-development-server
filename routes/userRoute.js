import express from 'express'
import {
  registerUser,
  loginUser,
  getUserInfo,
  addVisitedPost,
  getVisitedPosts,
  clearHistory,
} from '../controllers/UserController.js'
import { registerValidator, loginValidator } from '../validations/validation.js'
import validationErrors from '../validations/validationErrors.js'
import authentication from '../validations/authentication.js'
const userRouter = express.Router()

userRouter.post(
  '/auth/register',
  registerValidator,
  validationErrors,
  registerUser
)
userRouter.post('/auth/login', loginValidator, validationErrors, loginUser)
userRouter.get('/auth/user-info', authentication, getUserInfo)
userRouter.get('/posts/:id/visited', authentication, addVisitedPost)
userRouter.get('/auth/:id/history', authentication, getVisitedPosts)
userRouter.put('/auth/:id/clear-history', authentication, clearHistory)

export default userRouter
