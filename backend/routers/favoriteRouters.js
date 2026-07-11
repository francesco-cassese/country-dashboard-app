import express from "express";
import { index } from "../controllers/favoriteController.js"

const route = express.Router();

route.get('/', index);

export default route;