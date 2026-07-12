import { Link, useLocation, useParams } from 'react-router-dom';
import useCountryDetail from '../hooks/useCountryDetail';
import { buildCountryStats, buildCountryMemberships, buildCountryExternalLinks } from '../services/dataTransformer';
import { MEMBERSHIP_LABELS, LINK_LABELS, DRIVING_SIDE_LABELS } from '../constants/countryLabels';
import styles from './CountryDetail.module.css';

function CountryDetail() {
    const { ccn3 } = useParams();
    const location = useLocation();

    const { country, loading, error, isFavorite, togglingFavorite, toggleFavorite } =
        useCountryDetail(ccn3, location.state?.country);

    if (loading) return <div className={styles.statusMessage}>Caricamento in corso...</div>;
    if (error) return <div className={styles.statusMessage}>Errore: {error}</div>;
    if (!country) return <div className={styles.statusMessage}>Paese non trovato.</div>;

    const canFavorite = Boolean(country.codes?.ccn3);
    const stats = buildCountryStats(country, DRIVING_SIDE_LABELS);
    const memberships = buildCountryMemberships(country, MEMBERSHIP_LABELS);
    const externalLinks = buildCountryExternalLinks(country, LINK_LABELS);

    return (
        <div className={styles.detail}>
            <Link to="/" className={styles.backLink}>&larr; Torna alla lista</Link>

            <div className={styles.hero}>
                {country.flag?.url_svg && (
                    <img className={styles.flagImage} src={country.flag.url_svg} alt={`Bandiera di ${country.names?.common}`} />
                )}

                <div className={styles.heroInfo}>
                    <h1 className={styles.title}>
                        {country.flag?.emoji && <span className={styles.flagEmoji}>{country.flag.emoji}</span>}
                        {country.names?.common || 'N/D'}
                    </h1>
                    {country.names?.official && country.names.official !== country.names.common && (
                        <p className={styles.official}>{country.names.official}</p>
                    )}

                    {canFavorite ? (
                        <button className={styles.toggleButton} onClick={toggleFavorite} disabled={togglingFavorite}>
                            {isFavorite ? '★ Rimuovi dai preferiti' : '☆ Aggiungi ai preferiti'}
                        </button>
                    ) : (
                        <p className={styles.unavailableNote}>Preferiti non disponibili per questo paese.</p>
                    )}
                </div>
            </div>

            <div className={styles.statsGrid}>
                {stats.map((stat) => (
                    <div key={stat.label} className={styles.statTile}>
                        <span className={styles.statLabel}>{stat.label}</span>
                        <span className={styles.statValue}>{stat.value}</span>
                    </div>
                ))}
            </div>

            {country.borders?.length > 0 && (
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Confini</h2>
                    <div className={styles.chipRow}>
                        {country.borders.map((code) => (
                            <span key={code} className={styles.chip}>{code}</span>
                        ))}
                    </div>
                </section>
            )}

            {memberships.length > 0 && (
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Organizzazioni</h2>
                    <div className={styles.chipRow}>
                        {memberships.map((label) => (
                            <span key={label} className={styles.chip}>{label}</span>
                        ))}
                    </div>
                </section>
            )}

            {externalLinks.length > 0 && (
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Link utili</h2>
                    <div className={styles.chipRow}>
                        {externalLinks.map((link) => (
                            <a key={link.label} href={link.href} target="_blank" rel="noreferrer" className={styles.linkChip}>
                                {link.label} ↗
                            </a>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}

export default CountryDetail;
