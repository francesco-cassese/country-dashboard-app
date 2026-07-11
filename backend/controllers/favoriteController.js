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

    } catch (error) {
        console.error("Errore nel controller preferiti:", error);
        res.status(500).json({
            success: false,
            message: 'Errore interno del server'
        });
    }

}

const store = async (req, res) => {
    try {

        const newId = await Favorite.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Preferito aggiunto con successo',
            data: { newId, ...req.body }
        })

    } catch (error) {
        console.error("Errore nel salvataggio:", error);
        res.status(500).json({ success: false, message: 'Errore interno del server' });
    }

}

export { index, store };