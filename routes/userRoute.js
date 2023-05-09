import express from 'express'
import {
  registerUser,
  loginUser,
  getUserInfo,
  addVisitedPost,
  getVisitedPosts,
  clearHistory,
  addFavorite,
  getFavorites,
  removeFavorite,
  editUserInfo,
  editPassword,
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

userRouter.put('/auth/:id/edit', authentication, editUserInfo)

userRouter.put('/auth/:userId/edit-password', authentication, editPassword)

userRouter.get('/auth/:id/history', authentication, getVisitedPosts)

userRouter.put('/auth/:id/clear-history', authentication, clearHistory)

userRouter.get('/auth/favorites/:userId', authentication, getFavorites)

userRouter.post('/auth/favorites/:postId', authentication, addFavorite)

userRouter.delete('/auth/favorites/:postId', authentication, removeFavorite)

export default userRouter
