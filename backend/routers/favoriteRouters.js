import express from "express";
import { destroy, index, store } from "../controllers/favoriteController.js"
import validateFavorite from "../middlewares/favoriteValidator.js";
import validateId from "../middlewares/validateId.js";

const route = express.Router();

route.get('/', index);

route.post('/', [validateFavorite, store]);

route.delete('/:id', [validateId, destroy]);

export default route;