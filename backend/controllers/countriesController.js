const PAGE_SIZE = 25;

const getAllCountries = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page, 10) || 1);
        const offset = (page - 1) * PAGE_SIZE;

        const response = await fetch(`https://api.restcountries.com/countries/v5?limit=${PAGE_SIZE}&offset=${offset}`, {
            headers: { 'Authorization': `Bearer ${process.env.KEY_REST_COUNTRIES}` }
        });

        const result = await response.json();

        const countriesList = result.data.objects;
        const total = result.data.meta.total;

        res.status(200).json({
            success: true,
            data: countriesList,
            meta: {
                page,
                limit: PAGE_SIZE,
                total,
                totalPages: Math.ceil(total / PAGE_SIZE)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Impossibile recuperare i dati dai server esterni"
        });
    }
};

export { getAllCountries }

