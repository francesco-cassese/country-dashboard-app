import express from "express";
import connection from "../database/connection.js";
import Favorite from "../models/favoriteModel.js";

const index = async (req, res) => {
    try {

        const results = await Favorite.getAll();

        res.status(200).json({
            success: true,
            data: results
        })
        return;

    } catch (error) {
        console.error("Errore nel controller preferiti:", error);
        res.status(500).json({
            success: false,
            message: 'Errore interno del server'
        });
    }

}

export { index };