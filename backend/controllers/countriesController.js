const PAGE_SIZE = 24;
const CACHE_TTL_MS = 15 * 60 * 1000;

const cache = new Map();

const getCached = (key) => {
    const entry = cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
        cache.delete(key);
        return null;
    }
    return entry.value;
};

const setCached = (key, value) => {
    cache.set(key, { value, timestamp: Date.now() });
};

const getAllCountries = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page, 10) || 1);
        const offset = (page - 1) * PAGE_SIZE;
        const cacheKey = `list:${page}`;

        const cached = getCached(cacheKey);
        if (cached) {
            return res.status(200).json(cached);
        }

        const response = await fetch(`https://api.restcountries.com/countries/v5?limit=${PAGE_SIZE}&offset=${offset}`, {
            headers: { 'Authorization': `Bearer ${process.env.KEY_REST_COUNTRIES}` }
        });

        const result = await response.json();

        const countriesList = result.data.objects;
        const total = result.data.meta.total;

        const payload = {
            success: true,
            data: countriesList,
            meta: {
                page,
                limit: PAGE_SIZE,
                total,
                totalPages: Math.ceil(total / PAGE_SIZE)
            }
        };

        setCached(cacheKey, payload);
        res.status(200).json(payload);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Impossibile recuperare i dati dai server esterni"
        });
    }
};

const getCountryByCode = async (req, res) => {
    try {
        const { ccn3 } = req.params;
        const cacheKey = `country:${ccn3}`;

        const cached = getCached(cacheKey);
        if (cached) {
            return res.status(200).json(cached);
        }

        const response = await fetch(`https://api.restcountries.com/countries/v5?limit=1&codes.ccn3=${encodeURIComponent(ccn3)}`, {
            headers: { 'Authorization': `Bearer ${process.env.KEY_REST_COUNTRIES}` }
        });

        const result = await response.json();
        const country = result.data?.objects?.[0];

        if (!country) {
            return res.status(404).json({
                success: false,
                message: "Paese non trovato"
            });
        }

        const payload = {
            success: true,
            data: country
        };

        setCached(cacheKey, payload);
        res.status(200).json(payload);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Impossibile recuperare i dati dai server esterni"
        });
    }
};

export { getAllCountries, getCountryByCode }

