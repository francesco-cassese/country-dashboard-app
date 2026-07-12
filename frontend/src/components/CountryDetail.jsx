import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { apiFetch } from '../services/api';
import { addFavorite, removeFavorite } from '../services/favorites';
import styles from './CountryDetail.module.css';

const MEMBERSHIP_LABELS = {
    un: 'ONU',
    eu: 'Unione Europea',
    eurozone: 'Eurozona',
    schengen: 'Area Schengen',
    nato: 'NATO',
    g7: 'G7',
    g20: 'G20',
    oecd: 'OCSE',
    commonwealth: 'Commonwealth',
    african_union: 'Unione Africana',
    arab_league: 'Lega Araba',
    asean: 'ASEAN',
    brics: 'BRICS',
    opec: 'OPEC'
};

const LINK_LABELS = {
    official: 'Sito ufficiale',
    wikipedia: 'Wikipedia',
    google_maps: 'Google Maps',
    open_street_maps: 'OpenStreetMap'
};

const DRIVING_SIDE_LABELS = { right: 'Destra', left: 'Sinistra' };

function CountryDetail() {
    const { ccn3 } = useParams();
    const location = useLocation();

    const [country, setCountry] = useState(location.state?.country ?? null);
    const [loading, setLoading] = useState(!location.state?.country);
    const [error, setError] = useState(null);
    const [isFavorite, setIsFavorite] = useState(location.state?.country?.isFavorite ?? false);
    const [favoriteId, setFavoriteId] = useState(location.state?.country?.id ?? null);
    const [togglingFavorite, setTogglingFavorite] = useState(false);

    useEffect(() => {
        if (country) return;

        let cancelled = false;

        const loadCountry = async () => {
            try {
                setLoading(true);
                setError(null);

                const [countryResponse, favoritesResponse] = await Promise.all([
                    apiFetch(`/countries/${ccn3}`),
                    apiFetch('/favorities')
                ]);

                if (cancelled) return;

                const favorite = favoritesResponse.data.find((f) => Number(f.api_id) === Number(ccn3));

                setCountry(countryResponse.data);
                setIsFavorite(!!favorite);
                setFavoriteId(favorite ? favorite.id : null);
            } catch (err) {
                if (!cancelled) setError(err.message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        loadCountry();

        return () => { cancelled = true; };
    }, [ccn3, country]);

    const handleToggleFavorite = async () => {
        if (togglingFavorite) return;

        try {
            setTogglingFavorite(true);

            if (isFavorite) {
                await removeFavorite(favoriteId);
                setIsFavorite(false);
                setFavoriteId(null);
            } else {
                const created = await addFavorite(country);
                setIsFavorite(true);
                setFavoriteId(created.data.id);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setTogglingFavorite(false);
        }
    };

    if (loading) return <div className={styles.statusMessage}>Caricamento in corso...</div>;
    if (error) return <div className={styles.statusMessage}>Errore: {error}</div>;
    if (!country) return <div className={styles.statusMessage}>Paese non trovato.</div>;

    const canFavorite = Boolean(country.codes?.ccn3);

    const stats = [
        { label: 'Capitale', value: country.capitals?.[0]?.name },
        { label: 'Popolazione', value: country.population?.toLocaleString() },
        { label: 'Superficie', value: country.area?.kilometers ? `${country.area.kilometers.toLocaleString()} km²` : null },
        { label: 'Regione', value: [country.region, country.subregion].filter(Boolean).join(' · ') || null },
        { label: 'Lingue', value: country.languages?.length ? country.languages.map((l) => l.name).join(', ') : null },
        { label: 'Valute', value: country.currencies?.length ? country.currencies.map((c) => `${c.name} (${c.symbol})`).join(', ') : null },
        { label: 'Fusi orari', value: country.timezones?.length ? country.timezones.join(', ') : null },
        { label: 'Prefisso', value: country.calling_codes?.length ? country.calling_codes.map((c) => `+${c}`).join(', ') : null },
        { label: 'Guida', value: DRIVING_SIDE_LABELS[country.cars?.driving_side] ?? null },
        { label: 'Dominio', value: country.tlds?.length ? country.tlds.join(', ') : null },
        { label: 'Codice ISO2', value: country.codes?.alpha_2 },
        { label: 'Codice ISO3', value: country.codes?.alpha_3 }
    ].filter((stat) => stat.value);

    const memberships = Object.entries(country.memberships || {})
        .filter(([, active]) => active)
        .map(([key]) => MEMBERSHIP_LABELS[key] || key);

    const externalLinks = Object.entries(country.links || {})
        .filter(([key, href]) => LINK_LABELS[key] && href)
        .map(([key, href]) => ({ label: LINK_LABELS[key], href }));

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
                        <button className={styles.toggleButton} onClick={handleToggleFavorite} disabled={togglingFavorite}>
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
