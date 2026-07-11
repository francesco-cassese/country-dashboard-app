import { useEffect } from "react";
import useCountries from "../hooks/useCountries.js";
import CountryList from "./CountryList.jsx";

function Dashboard() {
    const { countries, loading, error, loadAllData, toggleFavorite } = useCountries();

    useEffect(() => {
        loadAllData();
    }, [loadAllData]);

    if (loading) return <div>Caricamento in corso...</div>;
    if (error) return <div>Errore: {error}</div>;

    return (
        <div className="dashboard-container">
            <h1>Dashboard Paesi</h1>
            <CountryList
                displayData={countries}
                onToggleFavorite={toggleFavorite}
            />
        </div>
    );
}

export default Dashboard;