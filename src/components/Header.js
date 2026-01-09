import { useState } from "react";
import HeaderNotification from "./HeaderNotification";
import NavMenu from "./menu/NavMenu";
import "./Header.css";

const Header = () => {
  const [mobileMenu, setMobileMenu] = useState(false);

  const handleMobileMenu = () => {
    setMobileMenu(!mobileMenu);
  };

  const handleCloseMobileMenu = () => {
    setMobileMenu(false);
  };
  return (
    <header className="header">
      <HeaderNotification />
      <NavMenu
        handleCloseMobileMenu={handleCloseMobileMenu}
        handleMobileMenu={handleMobileMenu}
        mobileMenu={mobileMenu}
      />
      <div className="header-menu"></div>
    </header>
  );
};

export default Header;
