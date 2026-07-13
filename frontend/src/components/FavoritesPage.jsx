import useFavorites from '../hooks/useFavorites';
import CountryList from './CountryList.jsx';
import styles from './FavoritesPage.module.css';

function FavoritesPage() {
    const { favorites, loading, error, toggleFavorite } = useFavorites();

    if (loading) return <div className={styles.statusMessage}>Caricamento in corso...</div>;
    if (error) return <div className={styles.statusMessage}>Errore: {error}</div>;

    return (
        <div className={styles.favoritesPage}>
            <h1 className={styles.title}>Preferiti</h1>

            <CountryList
                displayData={favorites}
                onToggleFavorite={toggleFavorite}
                emptyMessage="Nessun paese preferito ancora."
            />
        </div>
    );
}

export default FavoritesPage;
