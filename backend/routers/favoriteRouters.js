import express from "express";
import { index, store } from "../controllers/favoriteController.js"
import validateFavorite from "../middlewares/favoriteValidator.js";

const route = express.Router();

route.get('/', index);

route.post('/', [validateFavorite, store]);

export default route;