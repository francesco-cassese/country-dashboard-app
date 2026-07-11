const validateId = (req, res, next) => {

    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            error: "ID mancante nella richiesta"
        });
    }

    const numId = Number(id.trim());

    if (isNaN(numId)) {
        return res.status(400).json({
            error: "Valore dell'id non conforme o inesistente"
        });
    }

    if (!Number.isInteger(numId)) {
        return res.status(400).json({
            error: "L'ID deve essere un numero intero"
        });
    }

    if (numId <= 0) {
        return res.status(400).json({
            error: "Non esistono elementi con id minori o uguali a zero nel sistema"
        });
    }

    req.validateId = numId;

    next();
};

export default validateId;