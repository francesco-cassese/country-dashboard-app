import { Outlet } from 'react-router-dom';
import styles from './PageLayout.module.css';
import Navbar from '../components/Navbar';

function PageLayout() {
    return (
        <>
            <header>
                <div className={`${styles.containerHeader}`}>
                    <div className={`${styles.containerImg}`}>
                        <img src="/progetto-personale.png" alt="Immagine di una meridiana" />
                    </div>
                    <span className={`${styles.titlePage}`}>World Explorer</span>
                </div>
                <Navbar />
            </header>
            <Outlet />
            <footer>
                <p>© 2026 WorldExplorer. Tutti i diritti riservati.</p>
            </footer>
        </>
    )
}
export default PageLayout