import { useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import useData from "./hooks/useData";
import useLogout from "./hooks/useLogout";
import useWindowSize from "./hooks/useWindow";
import { useControlRaportBL } from './FKRaport/RaportConrolDocumentsBL';
import { useOrganizationStructureL } from './organization_structure/RaportOrganizationStructure';

import "./NavMenu.css";

const NavMenu = ({ handleCloseMobileMenu, mobileMenu }) => {
  const logout = useLogout();
  const navigate = useNavigate();
  const { auth } = useData();
  const { width } = useWindowSize();
  const controlRaportBL = useControlRaportBL();
  const organizationStructure = useOrganizationStructureL();

  const [menuActive, setMenuActive] = useState(false);
  const handleLinkClick = () => {
    if (mobileMenu) {
      return handleCloseMobileMenu();
    }
    setMenuActive(false);
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
          width ? () => setMenuActive(!menuActive) : () => setMenuActive(true)
        }
        onMouseLeave={
          width ? () => setMenuActive(false) : undefined
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
                    to="/obligations-table"
                    className="nav_menu-link"
                    onClick={handleLinkClick}
                  >
                    Zobowiązania
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
                {(auth?.roles?.includes(110) || auth?.roles?.includes(120) || auth?.roles?.includes(1000)) && (
                  <li className="nav_menu-item-dropmenu">
                    <Link
                      to="/fk-documents-table"
                      className="nav_menu-link"
                      onClick={handleLinkClick}
                    >
                      Dokumenty Raportu FK
                    </Link>
                  </li>)}
                {(auth?.roles?.includes(200) || auth?.roles?.includes(1000)) && (
                  <li className="nav_menu-item-dropmenu">
                    <Link
                      to="/fk-disabled-documents-table"
                      className="nav_menu-link"
                      onClick={handleLinkClick}
                    >
                      Wyłączenia Raportu FK
                    </Link>
                  </li>)}
              </ul>
            </div>
          </li>
        )}
        {(auth?.roles?.includes(120) || auth?.roles?.includes(200) || auth?.roles?.includes(1000)) && (
          <li className="nav_menu__menu-item">
            <Link className="nav_menu-link">Kontrola</Link>
            <div
              className={
                menuActive
                  ? "nav_menu-dropdown__menu"
                  : "nav_menu-dropdown__menu-disabled"
              }
            >
              <ul className="nav_menu__menu-dropmenu">
                <li className="nav_menu-item-dropmenu">
                  <span
                    className="nav_menu-link"
                    onClick={controlRaportBL}>
                    Raport kontroli BL
                  </span>
                </li>
              </ul>
              <ul className="nav_menu__menu-dropmenu">
                <li className="nav_menu-item-dropmenu">
                  <span
                    className="nav_menu-link"
                    onClick={organizationStructure}>
                    Struktura organizacji
                  </span>
                </li>
              </ul>
            </div>
          </li>
        )}

        {(auth?.roles?.includes(100) ||
          auth?.roles?.includes(200) ||
          auth?.roles?.includes(300) || auth?.roles?.includes(1000)) && (
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
                  {auth?.roles?.includes(100) && (
                    <li className="nav_menu-item-dropmenu">
                      <Link className="nav_menu-link">
                        <i className="fas fa-caret-left"></i>Raporty
                      </Link>
                      <div className="nav_menu-dropdown__menu--side_left">
                        <ul className="nav_menu__menu--side">
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
                          {auth?.roles?.includes(100) && (
                            <li className="nav_menu-item-dropmenu">
                              <Link
                                to="/raport-advisers"
                                className="nav_menu-link"
                                onClick={handleLinkClick}
                              >
                                Raport - Doradca
                              </Link>
                            </li>
                          )}
                        </ul>
                      </div>
                    </li>
                  )}

                  {(auth?.roles?.includes(200) || auth?.roles?.includes(1000)) && (
                    <li className="nav_menu-item-dropmenu">
                      <Link className="nav_menu-link">
                        <i className="fas fa-caret-left"></i>Raporty - FK
                      </Link>
                      <div className="nav_menu-dropdown__menu--side_left">
                        <ul className="nav_menu__menu--side">
                          {auth?.roles?.includes(200) && (
                            <li className="nav_menu-item-dropmenu">
                              <Link
                                to="/fk-add-data"
                                className="nav_menu-link"
                                onClick={handleLinkClick}
                              >
                                Generuj raport
                              </Link>
                            </li>
                          )}
                        </ul>
                      </div>
                    </li>
                  )}

                  {(auth?.roles?.includes(300) ||
                    auth?.roles?.includes(1000)) && (
                      <li className="nav_menu-item-dropmenu">
                        <Link
                          to="/raport-nora"
                          className="nav_menu-link"
                          onClick={handleLinkClick}
                        >
                          Raport - Nora
                        </Link>
                      </li>
                    )}
                  {(
                    auth?.roles?.includes(1000)) && (
                      <li className="nav_menu-item-dropmenu">
                        <Link
                          to="/trade-credit"
                          className="nav_menu-link"
                          onClick={handleLinkClick}
                        >
                          Kredyt Kupiecki
                        </Link>
                      </li>
                    )}
                </ul>
              </div>
            </li>
          )}

        {auth?.roles?.includes(5000) && (
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

        {(auth?.roles?.includes(1000) ||
          auth?.roles?.includes(200)) && (
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
                  {(auth?.roles?.includes(1000)) && (
                    <li className="nav_menu-item-dropmenu">
                      <Link
                        to="/user-settings"
                        className="nav_menu-link"
                        onClick={handleLinkClick}
                      >
                        Uprawnienia użytkownika
                      </Link>
                    </li>
                  )}
                  {(auth?.roles?.includes(1000) ||
                    auth?.roles?.includes(200)) && (
                      <li className="nav_menu-item-dropmenu">
                        <Link
                          to="/add-data"
                          className="nav_menu-link"
                          onClick={handleLinkClick}
                        >
                          Dodaj dane
                        </Link>
                      </li>
                    )}
                  {(auth?.roles?.includes(1000) ||
                    auth?.roles?.includes(200)) && (
                      <li className="nav_menu-item-dropmenu">
                        <Link className="nav_menu-link">
                          <i className="fas fa-caret-left"></i>Ustawienia
                        </Link>
                        <div className="nav_menu-dropdown__menu--side_left">
                          <ul className="nav_menu__menu--side">
                            {(auth?.roles?.includes(1000) ||
                              auth?.roles?.includes(200)) && (
                                <li className="nav_menu-item-dropmenu">
                                  <Link
                                    to="/table-settings"
                                    className="nav_menu-link"
                                    onClick={handleLinkClick}
                                  >
                                    Tabela - kolumny
                                  </Link>
                                </li>
                              )}
                            {(auth?.roles?.includes(1000) ||
                              auth?.roles?.includes(200)) && (
                                <li className="nav_menu-item-dropmenu">
                                  <Link
                                    to="/change-items"
                                    className="nav_menu-link"
                                    onClick={handleLinkClick}
                                  >
                                    Zmień stałe
                                  </Link>
                                </li>
                              )}
                            {(auth?.roles?.includes(1000) ||
                              auth?.roles?.includes(200)) && (
                                <li className="nav_menu-item-dropmenu">
                                  <Link
                                    to="/dept-mapper"
                                    className="nav_menu-link"
                                    onClick={handleLinkClick}
                                  >
                                    Dopasuj dane
                                  </Link>
                                </li>
                              )}
                          </ul>
                        </div>
                      </li>
                    )}
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
                {auth?.roles?.includes(1000) && (
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
