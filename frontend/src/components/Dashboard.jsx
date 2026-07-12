import { useEffect } from "react";
import useCountries from "../hooks/useCountries.js";
import CountryList from "./CountryList.jsx";
import styles from "./Dashboard.module.css";

function Dashboard() {
    const {
        countries,
        favorites,
        loading,
        isPaginating,
        error,
        page,
        totalPages,
        loadAllData,
        goToPage,
        toggleFavorite
    } = useCountries();

    useEffect(() => {
        loadAllData();
    }, [loadAllData]);

    if (loading) return <div className={styles.statusMessage}>Caricamento in corso...</div>;
    if (error) return <div className={styles.statusMessage}>Errore: {error}</div>;

    return (
        <div className={styles.dashboard}>
            <h1 className={styles.title}>Dashboard Paesi</h1>

            <CountryList
                displayData={countries}
                onToggleFavorite={toggleFavorite}
            />

            <nav className={styles.pagination}>
                <button
                    className={styles.pageButton}
                    onClick={() => goToPage(page - 1)}
                    disabled={page <= 1 || isPaginating}
                >
                    ← Precedente
                </button>
                <span className={styles.pageInfo}>
                    {isPaginating ? 'Caricamento...' : `Pagina ${page} di ${totalPages}`}
                </span>
                <button
                    className={styles.pageButton}
                    onClick={() => goToPage(page + 1)}
                    disabled={page >= totalPages || isPaginating}
                >
                    Successiva →
                </button>
            </nav>

            <section className={styles.favoritesSection}>
                <h2 className={styles.sectionTitle}>Preferiti</h2>
                <CountryList
                    displayData={favorites}
                    onToggleFavorite={toggleFavorite}
                    emptyMessage="Nessun paese preferito ancora."
                />
            </section>
        </div>
    );
}

export default Dashboard;
