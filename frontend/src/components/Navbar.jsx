import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";

function Navbar() {
    const linkClassName = ({ isActive }) => `${styles.link} ${isActive ? styles.linkActive : ""}`;

    return (
        <nav className={styles.nav}>
            <ul className={styles.list}>
                <li>
                    <NavLink to='/' end className={linkClassName}>
                        Dashboard
                    </NavLink>
                </li>
                <li>
                    <NavLink to='/favorites' className={linkClassName}>
                        Preferiti
                    </NavLink>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar;
