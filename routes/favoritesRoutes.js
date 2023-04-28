import express from "express";
import { getUserFavorites, addFavorite, removeFavorite } from '../controllers/FavoritesControllers.js';
import authentication from '../validations/authentication.js'
const favoritesRouter = express.Router()

favoritesRouter.get('/posts/favorites',authentication, getUserFavorites);
favoritesRouter.post('/posts/favorites/:postId',authentication, addFavorite);
favoritesRouter.delete('/posts/favorites/:postId', authentication, removeFavorite);

export default favoritesRouter;