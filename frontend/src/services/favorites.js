import { apiFetch } from './api';

const addFavorite = (country) => {
    const favoritePayload = {
        api_id: country.codes.ccn3,
        titolo: country.names.common,
        paese: country.names.common,
        contenuto: 'Paese preferito'
    };

    return apiFetch('/favorities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(favoritePayload)
    });
};

const removeFavorite = (id) => apiFetch(`/favorities/${id}`, { method: 'DELETE' });

export { addFavorite, removeFavorite };
