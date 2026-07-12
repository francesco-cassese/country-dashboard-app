import { useNavigate } from 'react-router-dom';
import styles from './CountryCard.module.css'

const CountryCard = ({ country, isFavorite, onToggleFavorite }) => {
    const navigate = useNavigate();
    const canFavorite = Boolean(country.codes.ccn3);

    const openDetail = () => {
        if (!canFavorite) return;
        navigate(`/countries/${country.codes.ccn3}`, { state: { country } });
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openDetail();
        }
    };

    return (
        <div
            className={`${styles.card} ${isFavorite ? styles.isFavorite : ''} ${canFavorite ? styles.clickable : ''}`}
            onClick={openDetail}
            role={canFavorite ? 'link' : undefined}
            tabIndex={canFavorite ? 0 : undefined}
            onKeyDown={canFavorite ? handleKeyDown : undefined}
        >
            <h3>{country.names.common}</h3>
            <p><strong>Capitale:</strong> {country.capitals?.[0]?.name || 'N/A'}</p>
            <p><strong>Popolazione:</strong> {country.population?.toLocaleString() || 'N/D'}</p>

            {isFavorite && (
                <span className={styles.favoriteBadge}>★ Preferito</span>
            )}

            {canFavorite ? (
                <button
                    className={styles.toggleButton}
                    onClick={(event) => { event.stopPropagation(); onToggleFavorite(country); }}
                >
                    {isFavorite ? '★ Rimuovi' : '☆ Aggiungi'}
                </button>
            ) : (
                <p
                    className={styles.unavailableNote}
                    title="Questo paese non ha un codice identificativo valido e non può essere aggiunto ai preferiti."
                >
                    Preferiti non disponibili
                </p>
            )}
        </div>
    );
};

export default CountryCard;