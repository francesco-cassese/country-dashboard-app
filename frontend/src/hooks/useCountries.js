import { useState, useCallback } from 'react';
import { apiFetch } from '../services/api';
import { mergeData } from '../services/dataTransformer';

const useCountries = () => {
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadAllData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const [countriesData, myFavorites] = await Promise.all([
                apiFetch('/countries'),
                apiFetch('/favorities')
            ]);

            if (!Array.isArray(countriesData) || !Array.isArray(myFavorites)) {
                throw new Error("Errore nel formato dati ricevuto dal server");
            }

            setCountries(mergeData(countriesData, myFavorites));
        } catch (err) {
            console.error("Errore nel caricamento:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const toggleFavorite = async (country) => {
        try {
            const countryCode = country.codes.ccn3;

            if (country.isFavorite) {
                await apiFetch(`/favorities/${country.id}`, { method: 'DELETE' });
            } else {
                const favoritePayload = {
                    api_id: countryCode,
                    titolo: country.names.common,
                    paese: country.names.common,
                    contenuto: 'Paese preferito'
                };

                await apiFetch('/favorities', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(favoritePayload)
                });
            }

            await loadAllData();
        } catch (err) {
            console.error("Errore durante il toggle:", err);
            throw err;
        }
    };

    return { countries, loading, error, loadAllData, toggleFavorite };
};

export default useCountries;