import styles from './CountryCard.module.css'

const CountryCard = ({ country, isFavorite, onToggleFavorite }) => {
    return (
        <div className={`${styles.card} ${isFavorite ? styles.isFavorite : ''}`}>
            <h3>{country.names.common}</h3>
            <p><strong>Capitale:</strong> {country.capitals?.[0]?.name || 'N/A'}</p>
            <p><strong>Popolazione:</strong> {country.population.toLocaleString()}</p>

            {isFavorite && (
                <span className={styles.favoriteBadge}>★ Preferito</span>
            )}

            <button onClick={() => onToggleFavorite(country)}>
                {isFavorite ? '★ Rimuovi' : '☆ Aggiungi'}
            </button>
        </div>
    );
};

export default CountryCard;