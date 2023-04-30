import express from "express";
import { getFavorites, addFavorite, removeFavorite } from '../controllers/FavoritesControllers.js';
import authentication from '../validations/authentication.js'
const favoritesRouter = express.Router()

favoritesRouter.get('/posts/favorites/:userId',authentication, getFavorites);
favoritesRouter.post('/posts/favorites/:postId',authentication, addFavorite);
favoritesRouter.delete('/posts/favorites/:postId', authentication, removeFavorite);

export default favoritesRouter;