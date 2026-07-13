import { NavLink } from "react-router-dom";

function Navbar() {
    return (
        <>
            <nav>
                <ul>
                    <li>
                        <NavLink to='/'>
                            Dashboard
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to='/favorites'>
                            Preferiti
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </>
    )
}

export default Navbar;