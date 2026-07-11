import styles from './CountryCard.module.css'

const CountryCard = ({ country, isFavorite, onToggleFavorite }) => {
    const canFavorite = Boolean(country.codes.ccn3);

    return (
        <div className={`${styles.card} ${isFavorite ? styles.isFavorite : ''}`}>
            <h3>{country.names.common}</h3>
            <p><strong>Capitale:</strong> {country.capitals?.[0]?.name || 'N/A'}</p>
            <p><strong>Popolazione:</strong> {country.population.toLocaleString()}</p>

            {isFavorite && (
                <span className={styles.favoriteBadge}>★ Preferito</span>
            )}

            {canFavorite ? (
                <button className={styles.toggleButton} onClick={() => onToggleFavorite(country)}>
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