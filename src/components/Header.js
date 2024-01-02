import HeaderNotification from './HeaderNotification';
import NavMenu from './NavMenu';
import './Header.css';

const Header = () => {
    return (
        <header className='header'>
            <HeaderNotification />
            <NavMenu />
        </header>
    );
};

export default Header;