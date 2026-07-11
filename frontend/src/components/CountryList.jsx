import CountryCard from './CountryCard.jsx';
import styles from './CountryList.module.css';

const CountryList = ({ displayData, onToggleFavorite, emptyMessage = 'Nessun dato disponibile.' }) => {
    if (!displayData || displayData.length === 0) {
        return <p className={styles.emptyMessage}>{emptyMessage}</p>;
    }

    return (
        <div className={styles.listContainer}>
            {displayData.map((country) => (
                <CountryCard
                    key={country.codes.ccn3}
                    country={country}
                    isFavorite={country.isFavorite}
                    onToggleFavorite={onToggleFavorite}
                />
            ))}
        </div>
    );
};

export default CountryList;