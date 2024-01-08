import { Link } from 'react-router-dom';

import './NavMenu.css';

const NavMenu = ({ handleCloseMobileMenu, mobileMenu }) => {
    return (
        <nav className='nav_menu'>
            <ul className={!mobileMenu ? 'nav_menu__menu' : 'nav_menu__menu active'}>
                <li className='nav_menu__menu-item'><Link className="nav_menu-link">Tabelka
                </Link>
                    <div className="nav_menu-dropdown__menu">
                        <ul className='nav_menu__menu-dropmenu'>
                            <li className='nav_menu-item-dropmenu'><Link to="/" className="nav_menu-link" onClick={handleCloseMobileMenu}>Aktualne
                            </Link></li>
                            <li className='nav_menu-item-dropmenu'><a>Archiwum</a></li>
                            <li className='nav_menu-item-dropmenu'><a>Kancelaria</a>
                            </li>
                            <li className='nav_menu-item-dropmenu'><a>Kpl dane</a>
                            </li>
                        </ul>
                    </div></li>
                <li className='nav_menu__menu-item'><a>Dodatki</a>
                    <div className="nav_menu-dropdown__menu">
                        <ul className='nav_menu__menu-dropmenu'>
                            <li className='nav_menu-item-dropmenu'><a>Mailing</a></li>
                            <li className='nav_menu-item-dropmenu'><Link to="/contacts" className="nav_menu-link" onClick={handleCloseMobileMenu}>Kontakty
                            </Link></li>

                        </ul>
                    </div>
                </li>
                <li className='nav_menu__menu-item'><a>Raporty</a>
                    <div className="nav_menu-dropdown__menu">
                        <ul className='nav_menu__menu-dropmenu'>
                            <li className='nav_menu-item-dropmenu'><a>Zbiorczy działu</a></li>
                            <li className='nav_menu-item-dropmenu'><a>Pracownika</a></li>
                            <li className='nav_menu-item-dropmenu'><a>Test
                                <i className='fas fa-caret-right' ></i>
                            </a>
                                <div className="nav_menu-dropdown__menu--side">
                                    <ul className='nav_menu__menu--side'>
                                        <li className='nav_menu-item-dropmenu--side'><a>Test-1</a></li>
                                        <li className='nav_menu-item-dropmenu--side'><a>Test-2</a></li>
                                        <li className='nav_menu-item-dropmenu--side'><a>Test-3</a></li>
                                        <li className='nav_menu-item-dropmenu--side'><a>Test-4</a></li>
                                    </ul>
                                </div>
                            </li>
                        </ul>
                    </div>
                </li>
                <li className='nav_menu__menu-item'><a>Ustawienia</a>
                    <div className="nav_menu-dropdown__menu">
                        <ul className='nav_menu__menu-dropmenu'>
                            <li className='nav_menu-item-dropmenu'><a>Kolumny tabeli</a></li>
                            <li className='nav_menu-item-dropmenu'><a>Kontakty</a></li>
                        </ul>
                    </div></li>
                <li className='nav_menu__menu-item'><a>Użytkownik</a><div className="nav_menu-dropdown__menu">
                    <ul className='nav_menu__menu-dropmenu'>
                        <li className='nav_menu-item-dropmenu'><a>Dodaj użytkownika</a></li>
                        <li className='nav_menu-item-dropmenu'><a>Zmień uprawnienia</a></li>
                        <li className='nav_menu-item-dropmenu'><a>Zmień hasło</a>
                        </li>
                        <li className='nav_menu-item-dropmenu'><a>Wyloguj</a></li>
                    </ul>
                </div></li>
            </ul>
        </nav>
    );
};

export default NavMenu;
