import express from "express";
import { getAllCountries } from "../controllers/countriesController.js";

const router = express.Router();

router.get('/', getAllCountries);

export default router;