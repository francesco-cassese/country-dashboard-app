import express from "express";
import cors from "cors";
import favoriteRoute from "./routers/favoriteRouters.js";

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use('/favorite', favoriteRoute);

app.listen(PORT, () => {
    console.log("server in ascolto sulla porta", PORT);
})