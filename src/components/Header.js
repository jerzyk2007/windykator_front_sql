import { useState } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import HeaderNotification from "./HeaderNotification";
import NavMenu from "./menu/NavMenu";
// import MobileMenu from './MobileMenu';
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
      <div className="header-menu">
        {/* {!mobileMenu ? <HiOutlineMenu onClick={handleMobileMenu} /> : <HiOutlineX onClick={handleMobileMenu} />} */}
      </div>
    </header>
  );
};

export default Header;
