import express from "express";
import cors from "cors";
import favoriteRouter from "./routers/favoriteRouters.js";
import countryRouter from "./routers/countriesRouters.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/favorities', favoriteRouter);

app.use('/countries', countryRouter);

app.listen(PORT, () => {
    console.log("server in ascolto sulla porta", PORT);
})