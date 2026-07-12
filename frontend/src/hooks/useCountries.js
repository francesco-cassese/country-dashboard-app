import { useState, useCallback } from 'react';
import { apiFetch } from '../services/api';
import { mergeData } from '../services/dataTransformer';

const favoriteCacheKey = (rawCode) => String(Number(rawCode));

const buildFavoritesCache = (prevCache, mergedCountries, favoritesFromApi) => {
    const next = {};

    favoritesFromApi.forEach((fav) => {
        const key = favoriteCacheKey(fav.api_id);
        next[key] = prevCache[key] || {
            codes: { ccn3: fav.api_id },
            names: { common: fav.paese || fav.titolo },
            isFavorite: true,
            id: fav.id
        };
    });

    mergedCountries.forEach((country) => {
        if (country.isFavorite) {
            next[favoriteCacheKey(country.codes.ccn3)] = country;
        }
    });

    return next;
};

const useCountries = () => {
    const [countries, setCountries] = useState([]);
    const [favoritesCache, setFavoritesCache] = useState({});
    const [loading, setLoading] = useState(true);
    const [isPaginating, setIsPaginating] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const loadAllData = useCallback(async (pageToLoad = 1) => {
        try {
            setIsPaginating(true);
            setError(null);

            const [countriesResponse, favoritesResponse] = await Promise.all([
                apiFetch(`/countries?page=${pageToLoad}`),
                apiFetch('/favorities')
            ]);

            const countriesData = countriesResponse.data;
            const myFavorites = favoritesResponse.data;

            if (!Array.isArray(countriesData) || !Array.isArray(myFavorites)) {
                throw new Error("Errore nel formato dati ricevuto dal server");
            }

            const merged = mergeData(countriesData, myFavorites);

            setCountries(merged);
            setFavoritesCache((prev) => buildFavoritesCache(prev, merged, myFavorites));
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

    const updateCountryFavoriteState = (countryCode, patch) => {
        setCountries((prev) => prev.map((country) =>
            country.codes.ccn3 === countryCode ? { ...country, ...patch } : country
        ));
    };

    const toggleFavorite = async (country) => {
        try {
            const countryCode = country.codes.ccn3;

            if (country.isFavorite) {
                await apiFetch(`/favorities/${country.id}`, { method: 'DELETE' });

                updateCountryFavoriteState(countryCode, { isFavorite: false, id: null });
                setFavoritesCache((prev) => {
                    const next = { ...prev };
                    delete next[favoriteCacheKey(countryCode)];
                    return next;
                });
            } else {
                const favoritePayload = {
                    api_id: countryCode,
                    titolo: country.names.common,
                    paese: country.names.common,
                    contenuto: 'Paese preferito'
                };

                const created = await apiFetch('/favorities', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(favoritePayload)
                });

                updateCountryFavoriteState(countryCode, { isFavorite: true, id: created.data.id });
                setFavoritesCache((prev) => ({
                    ...prev,
                    [favoriteCacheKey(countryCode)]: { ...country, isFavorite: true, id: created.data.id }
                }));
            }
        } catch (err) {
            console.error("Errore durante il toggle:", err);
            throw err;
        }
    };

    const favorites = Object.values(favoritesCache);

    return { countries, favorites, loading, isPaginating, error, page, totalPages, loadAllData, goToPage, toggleFavorite };
};

export default useCountries;
