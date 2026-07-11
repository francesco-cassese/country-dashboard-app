import express from "express";

const validateFavorite = (req, res, next) => {
    const { api_id, titolo, paese, contenuto } = req.body;

    // Controllo presenza campi

    if (!api_id || !titolo || !paese || !contenuto) {
        return res.status(400).json({
            success: false,
            message: 'Tutti i campi (api_id, titolo, paese, contenuto) sono obbligatori.'
        });
    }

    // Converto per sicurezza il numero in caso il front mi mandi il dato sottoforma di stringa

    const numericApiId = Number(api_id);

    // Controllo se non è un numero o se contiene caratteri non validi
    // L'uso di String(api_id).includes(' ') serve a bloccare stringhe con spazi (es: "10 25")

    if (isNaN(numericApiId) || String(api_id).includes(' ')) {
        return res.status(400).json({
            success: false,
            message: 'api_id deve essere un numero valido e senza spazi.'
        });
    }

    //Controllo la lunghezza del titolo

    if (titolo.trim().length < 3 || titolo.length > 255) {
        return res.status(400).json({ success: false, message: 'Il titolo deve essere tra 3 e 255 caratteri.' });
    }

    req.body.api_id = numericApiId;
    req.body.titolo = titolo.trim();
    req.body.paese = paese.trim();
    req.body.contenuto = contenuto.trim();

    next();
};

export default validateFavorite;

