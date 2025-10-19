import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import useData from "../hooks/useData";
import useLogout from "../hooks/useLogout";
import useWindowSize from "../hooks/useWindow";
import { useControlRaportBL } from "../raports/raportConrolDocumentsBL";
import { useOrganizationStructure } from "../raports/raportOrganizationStructure";
import { useDifferenceAs_Fk } from "../raports/raportDifferenceAs_Fk";
import { useLawStatement } from "../raports/raportLawStatement";
import "./NavMenu.css";
import { menuItems } from "./menuConfig"; // Import konfiguracji menu

const NavMenu = ({ handleCloseMobileMenu, mobileMenu }) => {
  const logout = useLogout();
  const navigate = useNavigate();
  const { auth } = useData();
  const { width } = useWindowSize();
  const controlRaportBL = useControlRaportBL();
  const organizationStructure = useOrganizationStructure();
  const differenceAs_Fk = useDifferenceAs_Fk();
  const lawStatement = useLawStatement();

  const [activeMenu, setActiveMenu] = useState(null); // Zmieniamy nazwę na activeMenu dla głównego dropdownu
  const [activeSideMenu, setActiveSideMenu] = useState(null); // Nowy stan dla side menu

  const handleLinkClick = () => {
    if (mobileMenu) {
      handleCloseMobileMenu();
    }
    setActiveMenu(null);
    setActiveSideMenu(null); // Resetuj też side menu
  };

  const handleLogout = async () => {
    handleLinkClick();
    await logout();
    navigate("/login");
  };

  // Funkcja do obsługi akcji (np. wylogowanie, generowanie raportu)
  const handleAction = (actionName) => {
    switch (actionName) {
      case "logout":
        handleLogout();
        break;
      case "controlRaportBL":
        controlRaportBL();
        break;
      case "organizationStructure":
        organizationStructure();
        break;
      case "differenceAs_Fk":
        differenceAs_Fk();
        break;
      case "lawStatement":
        lawStatement();
        break;
      default:
        console.warn(`Nieznana akcja: ${actionName}`);
    }
    handleLinkClick(); // Zamknij menu po akcji
  };

  // Funkcja sprawdzająca uprawnienia
  const hasAccess = (item) => {
    if (!item.roles && !item.permission) return true; // Domyślnie dostępne, jeśli brak ról/permisji

    if (item.roles && auth?.roles?.some((role) => item.roles.includes(role))) {
      return true;
    }
    if (item.permission && auth?.permissions?.[item.permission]) {
      return true;
    }
    return false;
  };

  const renderMenuItem = (item, isSideMenu = false) => {
    if (!hasAccess(item)) return null;

    const Component = item.path ? Link : item.action ? "span" : "div";
    const props = item.path
      ? { to: item.path, onClick: handleLinkClick }
      : item.action
      ? { onClick: () => handleAction(item.action) }
      : {};

    const menuLinkClass = "nav_menu-link" + (isSideMenu ? "" : ""); // Możesz dodać klasę dla side-menu linków

    return (
      <li
        key={item.label || item.title}
        className={
          isSideMenu ? "nav_menu-item-dropmenu--side" : "nav_menu-item-dropmenu"
        }
        onMouseEnter={
          item.sideMenu ? () => setActiveSideMenu(item.title) : undefined
        }
        onMouseLeave={item.sideMenu ? () => setActiveSideMenu(null) : undefined}
      >
        <Component className={menuLinkClass} {...props}>
          {item.sideMenu && <i className="fas fa-caret-left"></i>}
          {item.label || item.title}
        </Component>

        {item.sideMenu && (
          <div
            className={
              activeSideMenu === item.title
                ? "nav_menu-dropdown__menu--side_left"
                : "nav_menu-dropdown__menu--side_left-disabled" // Dodana klasa dla ukrycia
            }
          >
            <ul className="nav_menu__menu--side">
              {item.sideMenu.map((subItem) => renderMenuItem(subItem, true))}
            </ul>
          </div>
        )}
      </li>
    );
  };

  return (
    <nav className="nav_menu">
      <ul
        className={!mobileMenu ? "nav_menu__menu" : "nav_menu__menu active"}
        onClick={
          width <= 768 ? () => setActiveMenu(null) : undefined // Jeśli mobileMenu, to klikanie na ul nie rozwija głównego menu
        }
        onMouseLeave={width > 768 ? () => setActiveMenu(null) : undefined}
      >
        {menuItems.map((menuItem) =>
          hasAccess(menuItem) ? (
            <li
              key={menuItem.title}
              className="nav_menu__menu-item"
              onMouseEnter={() => width > 768 && setActiveMenu(menuItem.title)} // Rozwiń na hover na desktopie
              onMouseLeave={() => width > 768 && setActiveMenu(null)}
              onClick={() => width <= 768 && setActiveMenu(menuItem.title)} // Rozwiń na klik na mobile
            >
              <Link className="nav_menu-link">{menuItem.title}</Link>
              {menuItem.submenu && (
                <div
                  className={
                    activeMenu === menuItem.title
                      ? "nav_menu-dropdown__menu"
                      : "nav_menu-dropdown__menu-disabled"
                  }
                >
                  <ul className="nav_menu__menu-dropmenu">
                    {menuItem.submenu.map((subItem) => renderMenuItem(subItem))}
                  </ul>
                </div>
              )}
            </li>
          ) : null
        )}
      </ul>
    </nav>
  );
};

export default NavMenu;
