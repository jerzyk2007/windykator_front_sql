import { useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import useData from "../hooks/useData";
import useLogout from "../hooks/useLogout";
import useWindowSize from "../hooks/useWindow";
import { useControlRaportBL } from "../raports/raportConrolDocumentsBL";
import { useOrganizationStructure } from "../raports/raportOrganizationStructure";
import { useDifferenceAs_Fk } from "../raports/raportDifferenceAs_Fk";
import { useLawStatement } from "../raports/raportLawStatement";

import { menuItems } from "./menuConfig"; // Import konfiguracji menu
import "./NavMenu.css";

const NavMenu = ({ handleCloseMobileMenu, mobileMenu }) => {
  const logout = useLogout();
  const navigate = useNavigate();
  const { auth } = useData();
  const { width } = useWindowSize();
  const controlRaportBL = useControlRaportBL();
  const organizationStructure = useOrganizationStructure();
  const differenceAs_Fk = useDifferenceAs_Fk("insider");
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

  // const hasAccess = (item) => {
  //   // 1. Sprawdzanie Ról (Roles)
  //   let roleAccess = true;
  //   if (item.roles && item.roles.length > 0) {
  //     roleAccess = auth?.roles?.some((role) => item.roles.includes(role));
  //   }

  //   // 2. Sprawdzanie Permisji (Permissions - opcjonalne, jeśli używasz)
  //   let permissionAccess = true;
  //   if (item.permission) {
  //     permissionAccess = auth?.permissions?.[item.permission];
  //   }

  //   // 3. Sprawdzanie Spółek (Company)
  //   let companyAccess = true;
  //   if (item.company && item.company.length > 0) {
  //     // Pobieramy listę spółek użytkownika (zapewniamy, że to tablica)
  //     const userCompanies = Array.isArray(auth?.company) ? auth.company : [];

  //     // Warunek: wszystkie spółki z item.company muszą znaleźć się w userCompanies
  //     companyAccess = item.company.every((comp) =>
  //       userCompanies.includes(comp)
  //     );
  //   }

  //   // Wynik końcowy: Użytkownik musi przejść test ról/permisji ORAZ test spółek
  //   return (roleAccess || permissionAccess) && companyAccess;
  // };

  const hasAccess = (item) => {
    // 1. Sprawdzanie ról (jeśli zdefiniowane)
    let roleAccess = true;
    if (item.roles && item.roles.length > 0) {
      roleAccess = auth?.roles?.some((role) => item.roles.includes(role));
    }

    // 2. Sprawdzanie permisji (jeśli zdefiniowane)
    // Jeśli item nie ma pola permission, permissionAccess nie powinno wpływać na wynik
    let permissionAccess = false;
    let hasPermissionField = false;
    if (item.permission) {
      hasPermissionField = true;
      permissionAccess = auth?.permissions?.[item.permission];
    }

    // 3. Sprawdzanie spółek (jeśli zdefiniowane)
    let companyAccess = true;
    if (item.company && item.company.length > 0) {
      const userCompanies = Array.isArray(auth?.company) ? auth.company : [];
      companyAccess = item.company.every((comp) =>
        userCompanies.includes(comp)
      );
    }

    // LOGIKA DOSTĘPU:
    // Jeśli element ma i role i permisje -> wystarczy jedno z nich (OR)
    // Jeśli ma tylko role -> musi mieć rolę
    // Jeśli ma tylko permisje -> musi mieć permisję
    // Jeśli nie ma nic -> dostępny dla każdego

    let finalAccess = true;
    if (item.roles?.length > 0 && hasPermissionField) {
      finalAccess = roleAccess || permissionAccess;
    } else if (item.roles?.length > 0) {
      finalAccess = roleAccess;
    } else if (hasPermissionField) {
      finalAccess = permissionAccess;
    }

    return finalAccess && companyAccess;
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
        // onMouseEnter={
        //   item.sideMenu ? () => setActiveSideMenu(item.title) : undefined
        // }
        onMouseEnter={
          item.sideMenu ? () => setActiveSideMenu(item.label) : undefined
        }
        onMouseLeave={item.sideMenu ? () => setActiveSideMenu(null) : undefined}
      >
        <Component className={menuLinkClass} {...props}>
          {item.sideMenu && <i className="fas fa-caret-left"></i>}
          {item.label || item.title}
        </Component>

        {item.sideMenu && (
          <div
            // className={
            //   activeSideMenu === item.title
            //     ? "nav_menu-dropdown__menu--side_left"
            //     : "nav_menu-dropdown__menu--side_left-disabled" // Dodana klasa dla ukrycia
            // }
            className={
              activeSideMenu === item.label // tutaj też label
                ? "nav_menu-dropdown__menu--side_left"
                : "nav_menu-dropdown__menu--side_left-disabled"
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
