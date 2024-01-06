import './NavMenu.css';

const NavMenu = ({ handleCloseMobileMenu, mobileMenu }) => {
    return (
        <nav className='nav_menu'>
            <ul className={mobileMenu ? 'nav_menu__menu' : 'nav_menu__menu active'}>
                <li className='nav_menu__menu-item nav_menu-item'><a>Tabelka</a>
                    <div className="nav_menu-dropdown__menu">
                        <ul className='nav_menu__menu-dropmenu'>
                            <li className='nav_menu-item-dropmenu'><a>Aktualne</a></li>
                            <li className='nav_menu-item-dropmenu'><a>Archiwum</a></li>
                            <li className='nav_menu-item-dropmenu'><a>Kancelaria</a>
                            </li>
                            <li className='nav_menu-item-dropmenu'><a>Kpl dane</a>
                            </li>
                        </ul>
                    </div></li>
                <li className='nav_menu__menu-item nav_menu-item'><a>Dodatki</a>
                    <div className="nav_menu-dropdown__menu">
                        <ul className='nav_menu__menu-dropmenu'>
                            <li className='nav_menu-item-dropmenu'><a>Mailing</a></li>
                            <li className='nav_menu-item-dropmenu'><a>Kontakty</a></li>

                        </ul>
                    </div>
                </li>
                {/* <li><a>Pages <i className='fas fa-caret-down'></i></a> */}
                <li className='nav_menu__menu-item nav_menu-item'><a>Raporty</a>
                    <div className="nav_menu-dropdown__menu">
                        <ul className='nav_menu__menu-dropmenu'>
                            <li className='nav_menu-item-dropmenu'><a>Zbiorczy działu</a></li>
                            <li className='nav_menu-item-dropmenu'><a>Pracownika</a></li>
                            <li className='nav_menu-item-dropmenu'><a>Test <i className='fas fa-caret-right'></i></a>
                                <div className="nav_menu-dropdown__menu--side">
                                    <ul className='nav_menu__menu'>
                                        <li className='nav_menu-item-dropmenu'><a>Test-1</a></li>
                                        <li className='nav_menu-item-dropmenu'><a>Test-2</a></li>
                                        <li className='nav_menu-item-dropmenu'><a>Test-3</a></li>
                                        <li className='nav_menu-item-dropmenu'><a>Test-4</a></li>
                                    </ul>
                                </div>
                            </li>
                        </ul>
                    </div>
                </li>
                <li className='nav_menu__menu-item nav_menu-item'><a>Ustawienia</a>
                    <div className="nav_menu-dropdown__menu">
                        <ul className='nav_menu__menu-dropmenu'>
                            <li className='nav_menu-item-dropmenu'><a>Kolumny tabeli</a></li>
                            <li className='nav_menu-item-dropmenu'><a>Kontakty</a></li>
                        </ul>
                    </div></li>
                <li className='nav_menu__menu-item nav_menu-item'><a>Użytkownik</a><div className="nav_menu-dropdown__menu">
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
