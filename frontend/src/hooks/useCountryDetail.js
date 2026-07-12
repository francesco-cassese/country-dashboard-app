import { useEffect, useState } from 'react';
import { apiFetch } from '../services/api';
import { addFavorite, removeFavorite } from '../services/favorites';

const useCountryDetail = (ccn3, initialCountry) => {
    const [country, setCountry] = useState(initialCountry ?? null);
    const [loading, setLoading] = useState(!initialCountry);
    const [error, setError] = useState(null);
    const [isFavorite, setIsFavorite] = useState(initialCountry?.isFavorite ?? false);
    const [favoriteId, setFavoriteId] = useState(initialCountry?.id ?? null);
    const [togglingFavorite, setTogglingFavorite] = useState(false);

    useEffect(() => {
        if (country) return;

        let cancelled = false;

        const loadCountry = async () => {
            try {
                setLoading(true);
                setError(null);

                const [countryResponse, favoritesResponse] = await Promise.all([
                    apiFetch(`/countries/${ccn3}`),
                    apiFetch('/favorities')
                ]);

                if (cancelled) return;

                const favorite = favoritesResponse.data.find((f) => Number(f.api_id) === Number(ccn3));

                setCountry(countryResponse.data);
                setIsFavorite(!!favorite);
                setFavoriteId(favorite ? favorite.id : null);
            } catch (err) {
                if (!cancelled) setError(err.message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        loadCountry();

        return () => { cancelled = true; };
    }, [ccn3, country]);

    const toggleFavorite = async () => {
        if (togglingFavorite) return;

        try {
            setTogglingFavorite(true);

            if (isFavorite) {
                await removeFavorite(favoriteId);
                setIsFavorite(false);
                setFavoriteId(null);
            } else {
                const created = await addFavorite(country);
                setIsFavorite(true);
                setFavoriteId(created.data.id);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setTogglingFavorite(false);
        }
    };

    return { country, loading, error, isFavorite, togglingFavorite, toggleFavorite };
};

export default useCountryDetail;
