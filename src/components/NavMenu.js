import './NavMenu.css';

const NavMenu = () => {
    return (
        <nav className='nav_menu'>
            <ul>
                <li><a>Tabelka</a>
                    <div className="nav_menu-dropdown__menu">
                        <ul>
                            <li><a>Dane</a></li>
                            <li><a>Archiwum</a></li>
                            <li><a>Kancelaria</a>
                            </li>
                        </ul>
                    </div></li>
                <li><a>Dodatki</a>
                    <div className="nav_menu-dropdown__menu">
                        <ul>
                            <li><a>Mailing</a></li>
                            <li><a>Kontakty</a></li>

                        </ul>
                    </div>
                </li>
                {/* <li><a>Pages <i className='fas fa-caret-down'></i></a> */}
                <li><a>Raporty</a>
                    <div className="nav_menu-dropdown__menu">
                        <ul>
                            <li><a>Zbiorczy działu</a></li>
                            <li><a>Pracownika</a></li>
                            <li><a>Test <i className='fas fa-caret-right'></i></a>
                                <div className="nav_menu-dropdown__menu-1">
                                    <ul>
                                        <li><a>Test-1</a></li>
                                        <li><a>Test-2</a></li>
                                        <li><a>Test-3</a></li>
                                        <li><a>Test-4</a></li>
                                    </ul>
                                </div>
                            </li>
                        </ul>
                    </div>
                </li>
                <li><a>Ustawienia</a>
                    <div className="nav_menu-dropdown__menu">
                        <ul>
                            <li><a>Kolumny tabeli</a></li>
                            <li><a>Kontakty</a></li>
                        </ul>
                    </div></li>
                <li><a>Użytkownik</a><div className="nav_menu-dropdown__menu">
                    <ul>
                        <li><a>Dodaj użytkownika</a></li>
                        <li><a>Zmień uprawnienia</a></li>
                        <li><a>Zmień hasło</a>
                        </li>
                        <li><a>Wyloguj</a></li>
                    </ul>
                </div></li>
            </ul>
        </nav>

    );
};

export default NavMenu;