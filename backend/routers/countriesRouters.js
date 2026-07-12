import express from "express";
import { getAllCountries, getCountryByCode } from "../controllers/countriesController.js";

const router = express.Router();

router.get('/', getAllCountries);
router.get('/:ccn3', getCountryByCode);

export default router;