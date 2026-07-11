const getAllCountries = async (req, res) => {
    try {
        const response = await fetch('https://api.restcountries.com/countries/v5/all', {
            headers: { 'Authorization': `Bearer ${process.env.DEMO_KEY_REST_COUNTRIES}` }
        });

        const result = await response.json();

        const countriesList = result.data.objects;

        res.status(200).json({
            success: true,
            data: countriesList
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Impossibile recuperare i dati dai server esterni"
        });
    }
};

export { getAllCountries }

