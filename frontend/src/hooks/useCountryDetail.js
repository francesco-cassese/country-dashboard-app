import { useEffect, useState } from 'react';
import { apiFetch } from '../services/api';
import useFavorites from './useFavorites';

const useCountryDetail = (ccn3, initialCountry) => {
    const { isFavorite: isFavoriteInContext, getFavoriteId, toggleFavorite: toggleFavoriteContext } = useFavorites();
    const [country, setCountry] = useState(initialCountry ?? null);
    const [loading, setLoading] = useState(!initialCountry);
    const [error, setError] = useState(null);
    const [togglingFavorite, setTogglingFavorite] = useState(false);

    useEffect(() => {
        if (country) return;

        let cancelled = false;

        const loadCountry = async () => {
            try {
                setLoading(true);
                setError(null);

                const countryResponse = await apiFetch(`/countries/${ccn3}`);

                if (cancelled) return;

                setCountry(countryResponse.data);
            } catch (err) {
                if (!cancelled) setError(err.message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        loadCountry();

        return () => { cancelled = true; };
    }, [ccn3, country]);

    const isFavorite = isFavoriteInContext(ccn3);
    const favoriteId = getFavoriteId(ccn3);

    const toggleFavorite = async () => {
        if (togglingFavorite) return;

        try {
            setTogglingFavorite(true);

            await toggleFavoriteContext({ ...country, isFavorite, id: favoriteId });
        } catch (err) {
            setError(err.message);
        } finally {
            setTogglingFavorite(false);
        }
    };

    return { country, loading, error, isFavorite, togglingFavorite, toggleFavorite };
};

export default useCountryDetail;
