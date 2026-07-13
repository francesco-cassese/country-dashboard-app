import { useState, useCallback, useMemo } from 'react';
import { apiFetch } from '../services/api';
import useFavorites from './useFavorites';

const useCountries = () => {
    const { favorites, toggleFavorite: toggleFavoriteContext, mergeFavoriteStatus } = useFavorites();
    const [rawCountries, setRawCountries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isPaginating, setIsPaginating] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const loadAllData = useCallback(async (pageToLoad = 1) => {
        try {
            setIsPaginating(true);
            setError(null);

            const countriesResponse = await apiFetch(`/countries?page=${pageToLoad}`);
            const countriesData = countriesResponse.data;

            if (!Array.isArray(countriesData)) {
                throw new Error("Errore nel formato dati ricevuto dal server");
            }

            setRawCountries(countriesData);
            setPage(countriesResponse.meta.page);
            setTotalPages(countriesResponse.meta.totalPages);
        } catch (err) {
            console.error("Errore nel caricamento:", err);
            setError(err.message);
        } finally {
            setLoading(false);
            setIsPaginating(false);
        }
    }, []);

    const goToPage = (nextPage) => {
        if (nextPage < 1 || nextPage > totalPages || isPaginating) return;
        loadAllData(nextPage);
    };

    const countries = useMemo(() => mergeFavoriteStatus(rawCountries), [rawCountries, favorites]);

    const toggleFavorite = async (country) => {
        await toggleFavoriteContext(country);
    };

    return { countries, favorites, loading, isPaginating, error, page, totalPages, loadAllData, goToPage, toggleFavorite };
};

export default useCountries;
