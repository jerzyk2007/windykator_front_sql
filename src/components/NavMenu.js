import { useState } from 'react';
import { Link } from 'react-router-dom';
import './NavMenu.css';

const NavMenu = ({ handleCloseMobileMenu, mobileMenu }) => {
    const [isMenuActive, setMenuActive] = useState(false);

    console.log(mobileMenu);

    const toggleActiveState = () => {
        setMenuActive(!isMenuActive);
    };

    const handleLinkClick = () => {
        handleCloseMobileMenu();
        setMenuActive(false);

    };

    return (
        <nav className='nav_menu'>
            <ul className={!mobileMenu ? 'nav_menu__menu' : 'nav_menu__menu active'}  >
                <li className='nav_menu__menu-item'><Link className="nav_menu-link" onClick={toggleActiveState}>Tabelka
                </Link>
                    {/* <div className="nav_menu-dropdown__menu"> */}
                    <div className={isMenuActive ? 'nav_menu-dropdown__menu' : 'nav_menu-dropdown__menu-disabled'} onMouseLeave={() => setMenuActive(false)}>
                        <ul className='nav_menu__menu-dropmenu' >
                            <li className='nav_menu-item-dropmenu'><Link to="/" className="nav_menu-link" onClick={handleLinkClick}>Aktualne
                            </Link></li>
                            <li className='nav_menu-item-dropmenu'><Link className="nav_menu-link" onClick={handleLinkClick}>Archiwum
                            </Link></li>
                            <li className='nav_menu-item-dropmenu'><Link className="nav_menu-link" onClick={handleLinkClick}>Kancelaria
                            </Link>
                            </li>
                            <li className='nav_menu-item-dropmenu'><Link className="nav_menu-link" onClick={handleLinkClick}>Kpl dane
                            </Link>
                            </li>
                        </ul>
                    </div></li>
                {/* <li className='nav_menu__menu-item'><Link className="nav_menu-link">Dodatki */}
                <li className='nav_menu__menu-item'><Link className="nav_menu-link" onClick={toggleActiveState}>Dodatki
                </Link>
                    {/* <div className="nav_menu-dropdown__menu"> */}
                    <div className={isMenuActive ? 'nav_menu-dropdown__menu' : 'nav_menu-dropdown__menu-disabled'} onMouseLeave={() => setMenuActive(false)}>
                        <ul className='nav_menu__menu-dropmenu'>
                            <li className='nav_menu-item-dropmenu'><Link className="nav_menu-link" onClick={handleLinkClick}>Mailing
                            </Link></li>
                            <li className='nav_menu-item-dropmenu'><Link to="/contacts" className="nav_menu-link" onClick={handleLinkClick}>Kontakty
                            </Link></li>

                        </ul>
                    </div>
                </li>
                <li className='nav_menu__menu-item'><Link className="nav_menu-link" onClick={toggleActiveState}>Raporty
                </Link>
                    {/* <div className="nav_menu-dropdown__menu"> */}
                    <div className={isMenuActive ? 'nav_menu-dropdown__menu' : 'nav_menu-dropdown__menu-disabled'} onMouseLeave={() => setMenuActive(false)}>
                        <ul className='nav_menu__menu-dropmenu'>
                            <li className='nav_menu-item-dropmenu'><Link className="nav_menu-link" onClick={handleLinkClick}>Zbiorczy
                            </Link></li>
                            <li className='nav_menu-item-dropmenu'><Link className="nav_menu-link" onClick={handleLinkClick}>Pracownika
                            </Link></li>
                            <li className='nav_menu-item-dropmenu'><Link className="nav_menu-link">Test

                                <i className='fas fa-caret-right' ></i>
                            </Link>
                                <div className="nav_menu-dropdown__menu--side">
                                    <ul className='nav_menu__menu--side'>
                                        <li className='nav_menu-item-dropmenu--side'><Link className="nav_menu-link" onClick={handleLinkClick}>Test-1
                                        </Link></li>
                                        <li className='nav_menu-item-dropmenu--side'><Link className="nav_menu-link" onClick={handleLinkClick}>Test-2
                                        </Link></li>
                                        <li className='nav_menu-item-dropmenu--side'><Link className="nav_menu-link" onClick={handleLinkClick}>Test-3
                                        </Link></li>
                                        <li className='nav_menu-item-dropmenu--side'><Link className="nav_menu-link" onClick={handleLinkClick}>Test-4
                                        </Link></li>
                                    </ul>
                                </div>
                            </li>
                        </ul>
                    </div>
                </li>
                <li className='nav_menu__menu-item'><Link className="nav_menu-link" onClick={toggleActiveState}>Ustawienia
                </Link>
                    {/* <div className="nav_menu-dropdown__menu"> */}
                    <div className={isMenuActive ? 'nav_menu-dropdown__menu' : 'nav_menu-dropdown__menu-disabled'} onMouseLeave={() => setMenuActive(false)}>
                        <ul className='nav_menu__menu-dropmenu'>
                            <li className='nav_menu-item-dropmenu'><Link className="nav_menu-link" onClick={handleLinkClick}>Kolumny tabeli
                            </Link></li>
                            <li className='nav_menu-item-dropmenu'><Link className="nav_menu-link" onClick={handleLinkClick}>Ustawienia
                            </Link></li>
                        </ul>
                    </div></li>
                <li className='nav_menu__menu-item'><Link className="nav_menu-link" onClick={toggleActiveState}>Użytkownik
                </Link>
                    {/* <div className="nav_menu-dropdown__menu"> */}
                    <div className={isMenuActive ? 'nav_menu-dropdown__menu' : 'nav_menu-dropdown__menu-disabled'} onMouseLeave={() => setMenuActive(false)}>
                        <ul className='nav_menu__menu-dropmenu'>
                            <li className='nav_menu-item-dropmenu'><Link className="nav_menu-link" onClick={handleLinkClick}>Dodaj użytkownika
                            </Link></li>
                            <li className='nav_menu-item-dropmenu'><Link className="nav_menu-link" onClick={handleLinkClick}>Zmień uprawnienia
                            </Link></li>
                            <li className='nav_menu-item-dropmenu'><Link className="nav_menu-link" onClick={handleLinkClick}>Zmień hasło
                            </Link>
                            </li>
                            <li className='nav_menu-item-dropmenu'><Link className="nav_menu-link" onClick={handleLinkClick}>Wyloguj
                            </Link></li>
                        </ul>
                    </div></li>
            </ul>
        </nav >
    );
};

export default NavMenu;
;
