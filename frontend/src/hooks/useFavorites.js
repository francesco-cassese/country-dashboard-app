import { useContext } from 'react';
import { FavoritesContext } from '../context/FavoritesContext';

const useFavorites = () => {
    const context = useContext(FavoritesContext);

    if (!context) {
        throw new Error('useFavorites deve essere usato all\'interno di un FavoritesProvider');
    }

    return context;
};

export default useFavorites;
