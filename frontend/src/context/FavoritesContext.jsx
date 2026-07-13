import { createContext, useEffect, useState } from 'react';
import { apiFetch } from '../services/api';
import { mergeData } from '../services/dataTransformer';
import { addFavorite, removeFavorite } from '../services/favorites';

const favoriteCacheKey = (rawCode) => String(Number(rawCode));

const isMinimalCacheEntry = (cached) => !cached?.codes?.alpha_2;

const buildInitialFavoritesCache = (favoritesFromApi) => {
    const next = {};

    favoritesFromApi.forEach((fav) => {
        const key = favoriteCacheKey(fav.api_id);
        next[key] = {
            codes: { ccn3: fav.api_id },
            names: { common: fav.paese || fav.titolo },
            isFavorite: true,
            id: fav.id
        };
    });

    return next;
};

const FavoritesContext = createContext(null);

const FavoritesProvider = ({ children }) => {
    const [favoritesCache, setFavoritesCache] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await apiFetch('/favorities');
                const myFavorites = response.data;

                if (!Array.isArray(myFavorites)) {
                    throw new Error("Errore nel formato dati ricevuto dal server");
                }

                setFavoritesCache(buildInitialFavoritesCache(myFavorites));
            } catch (err) {
                console.error("Errore nel caricamento dei preferiti:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, []);

    const isFavorite = (ccn3) => Boolean(favoritesCache[favoriteCacheKey(ccn3)]);

    const getFavoriteId = (ccn3) => favoritesCache[favoriteCacheKey(ccn3)]?.id ?? null;

    const toggleFavorite = async (country) => {
        try {
            const countryCode = country.codes.ccn3;

            if (country.isFavorite) {
                await removeFavorite(country.id);

                setFavoritesCache((prev) => {
                    const next = { ...prev };
                    delete next[favoriteCacheKey(countryCode)];
                    return next;
                });
            } else {
                const created = await addFavorite(country);

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

    const mergeFavoriteStatus = (countries) => {
        const merged = mergeData(countries, Object.values(favoritesCache).map((fav) => ({
            api_id: fav.codes.ccn3,
            id: fav.id
        })));

        const enrichable = merged.filter((country) =>
            country.isFavorite && isMinimalCacheEntry(favoritesCache[favoriteCacheKey(country.codes.ccn3)])
        );

        if (enrichable.length > 0) {
            setFavoritesCache((prev) => {
                const next = { ...prev };
                enrichable.forEach((country) => {
                    next[favoriteCacheKey(country.codes.ccn3)] = country;
                });
                return next;
            });
        }

        return merged;
    };

    const favorites = Object.values(favoritesCache);

    const value = {
        favorites,
        loading,
        error,
        isFavorite,
        getFavoriteId,
        toggleFavorite,
        mergeFavoriteStatus
    };

    return (
        <FavoritesContext.Provider value={value}>
            {children}
        </FavoritesContext.Provider>
    );
};

export { FavoritesContext, FavoritesProvider };
