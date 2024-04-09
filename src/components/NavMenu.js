import { useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import useData from "./hooks/useData";
import useLogout from "./hooks/useLogout";
import useWindowSize from "./hooks/useWindow";
import "./NavMenu.css";

const NavMenu = ({ handleCloseMobileMenu, mobileMenu }) => {
  const logout = useLogout();
  const navigate = useNavigate();
  const { auth } = useData();
  const { width } = useWindowSize();

  const [menuActive, setMenuActive] = useState(false);
  const handleLinkClick = () => {
    // setMenuActive(false);
    if (mobileMenu) {
      handleCloseMobileMenu();
    }
  };

  const handleLogout = async () => {
    handleLinkClick();
    await logout();
    navigate("/login");
  };
  return (
    <nav className="nav_menu">
      <ul
        className={!mobileMenu ? "nav_menu__menu" : "nav_menu__menu active"}
        onClick={
          width && width >= 960
            ? () => setMenuActive(!menuActive)
            : () => setMenuActive(true)
        }
        onMouseLeave={
          width && width >= 960 ? () => setMenuActive(false) : undefined
        }
      >
        {auth?.roles?.includes(100) && (
          <li className="nav_menu__menu-item">
            <Link className="nav_menu-link">Tabelka</Link>
            <div
              className={
                menuActive
                  ? "nav_menu-dropdown__menu"
                  : "nav_menu-dropdown__menu-disabled"
              }
            >
              <ul className="nav_menu__menu-dropmenu">
                <li className="nav_menu-item-dropmenu">
                  <Link
                    to="/actual-table"
                    className="nav_menu-link"
                    onClick={handleLinkClick}
                  >
                    Aktualne
                  </Link>
                </li>
                <li className="nav_menu-item-dropmenu">
                  <Link
                    to="/archive-table"
                    className="nav_menu-link"
                    onClick={handleLinkClick}
                  >
                    Archiwum
                  </Link>
                </li>
                {/* <li className='nav_menu-item-dropmenu'><Link className="nav_menu-link" onClick={handleLinkClick}>Kancelaria
                            </Link>
                            </li> */}
                <li className="nav_menu-item-dropmenu">
                  <Link
                    to="/all-data-table"
                    className="nav_menu-link"
                    onClick={handleLinkClick}
                  >
                    Kpl dane
                  </Link>
                </li>
              </ul>
            </div>
          </li>
        )}

        {auth?.roles?.includes(100) && (
          <li className="nav_menu__menu-item">
            <Link className="nav_menu-link">Raporty</Link>
            <div
              className={
                menuActive
                  ? "nav_menu-dropdown__menu"
                  : "nav_menu-dropdown__menu-disabled"
              }
            >
              <ul className="nav_menu__menu-dropmenu">
                {auth?.permissions?.Standard && (
                  <li className="nav_menu-item-dropmenu">
                    <Link
                      to="/raport-departments"
                      className="nav_menu-link"
                      onClick={handleLinkClick}
                    >
                      Raport - Dział
                    </Link>
                  </li>
                )}
                <li className="nav_menu-item-dropmenu">
                  <Link
                    to="/raport-advisers"
                    className="nav_menu-link"
                    onClick={handleLinkClick}
                  >
                    Raport - Doradca
                  </Link>
                </li>
                {/* <li className='nav_menu-item-dropmenu'><Link className="nav_menu-link" onClick={handleLinkClick}>Pracownika
                            </Link></li> */}
                {/* <li className='nav_menu-item-dropmenu'><Link className="nav_menu-link">
                                <i className='fas fa-caret-right' ></i>Test
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
                            </li> */}
              </ul>
            </div>
          </li>
        )}

        {auth?.roles?.includes(220) && (
          <li className="nav_menu__menu-item">
            <Link className="nav_menu-link">Raport FK</Link>
            <div
              className={
                menuActive
                  ? "nav_menu-dropdown__menu"
                  : "nav_menu-dropdown__menu-disabled"
              }
            >
              <ul className="nav_menu__menu-dropmenu">
                <li className="nav_menu-item-dropmenu">
                  <Link
                    to="/fk-raport"
                    className="nav_menu-link"
                    onClick={handleLinkClick}
                  >
                    Raport
                  </Link>
                </li>
                {auth?.roles?.includes(220) && auth?.roles?.includes(300) && (
                  <li className="nav_menu-item-dropmenu">
                    <Link
                      to="/fk-add-data"
                      className="nav_menu-link"
                      onClick={handleLinkClick}
                    >
                      Dodaj dane
                    </Link>
                  </li>
                )}
                {auth?.roles?.includes(220) && auth?.roles?.includes(300) && (
                  <li className="nav_menu-item-dropmenu">
                    <Link
                      to="/fk-table-settings"
                      className="nav_menu-link"
                      onClick={handleLinkClick}
                    >
                      Ustawienia
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </li>
        )}

        {auth?.roles?.includes(500) && (
          <li className="nav_menu__menu-item">
            <Link className="nav_menu-link">Kontakty</Link>
            <div
              className={
                menuActive
                  ? "nav_menu-dropdown__menu"
                  : "nav_menu-dropdown__menu-disabled"
              }
            >
              <ul className="nav_menu__menu-dropmenu">
                <li className="nav_menu-item-dropmenu">
                  <Link
                    to="/contacts"
                    className="nav_menu-link"
                    onClick={handleLinkClick}
                  >
                    Wyszukaj
                  </Link>
                </li>
                <li className="nav_menu-item-dropmenu">
                  <Link className="nav_menu-link" onClick={handleLinkClick}>
                    Dodaj
                  </Link>
                </li>
              </ul>
            </div>
          </li>
        )}

        {auth?.roles?.includes(300) && (
          <li className="nav_menu__menu-item">
            <Link className="nav_menu-link">System</Link>
            <div
              className={
                menuActive
                  ? "nav_menu-dropdown__menu"
                  : "nav_menu-dropdown__menu-disabled"
              }
            >
              <ul className="nav_menu__menu-dropmenu">
                <li className="nav_menu-item-dropmenu">
                  <Link
                    to="/add-data"
                    className="nav_menu-link"
                    onClick={handleLinkClick}
                  >
                    Dodaj dane
                  </Link>
                </li>
                <li className="nav_menu-item-dropmenu">
                  <Link
                    to="/user-settings"
                    className="nav_menu-link"
                    onClick={handleLinkClick}
                  >
                    Uprawnienia użytkownika
                  </Link>
                </li>
                <li className="nav_menu-item-dropmenu">
                  <Link
                    to="/table-settings"
                    className="nav_menu-link"
                    onClick={handleLinkClick}
                  >
                    Ustawienia tabel
                  </Link>
                </li>
              </ul>
            </div>
          </li>
        )}
        <li className="nav_menu__menu-item">
          <Link className="nav_menu-link">Użytkownik</Link>
          {menuActive && (
            <div className="nav_menu-dropdown__menu">
              <ul className="nav_menu__menu-dropmenu">
                {auth?.roles?.includes(100) && (
                  <li className="nav_menu-item-dropmenu">
                    <Link
                      to="/"
                      className="nav_menu-link"
                      onClick={handleLinkClick}
                    >
                      Informacje
                    </Link>
                  </li>
                )}
                {auth?.roles?.includes(300) && (
                  <li className="nav_menu-item-dropmenu">
                    <Link
                      to="/register"
                      className="nav_menu-link"
                      onClick={handleLinkClick}
                    >
                      Dodaj użytkownika
                    </Link>
                  </li>
                )}
                {/* {auth?.roles?.includes(300) && <li className='nav_menu-item-dropmenu'><Link className="nav_menu-link" onClick={handleLinkClick}>Zmień uprawnienia
                            </Link></li>} */}
                <li className="nav_menu-item-dropmenu">
                  <Link
                    to="/change-password"
                    className="nav_menu-link"
                    onClick={handleLinkClick}
                  >
                    Zmień hasło
                  </Link>
                </li>
                <li className="nav_menu-item-dropmenu">
                  <Link className="nav_menu-link" onClick={handleLogout}>
                    Wyloguj
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default NavMenu;
