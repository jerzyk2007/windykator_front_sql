import './NavMenu.css';

const NavMenu = () => {
    return (
        <nav className='nav_menu'>
            <ul>
                <li><a>Home</a> </li>
                <li><a>About</a></li>
                {/* <li><a>Pages <i className='fas fa-caret-down'></i></a> */}
                <li><a>Pages</a>
                    <div className="nav_menu-dropdown__menu">
                        <ul>
                            <li><a>Pricing</a></li>
                            <li><a>Portfolio</a></li>
                            <li><a>Team <i className='fas fa-caret-right'></i></a>
                                <div className="nav_menu-dropdown__menu-1">
                                    <ul>
                                        <li><a>Team-1</a></li>
                                        <li><a>Team-2</a></li>
                                        <li><a>Team-3</a></li>
                                        <li><a>Team-4</a></li>
                                    </ul>
                                </div>
                            </li>
                            <li><a>FAQ</a></li>
                        </ul>
                    </div>
                </li>
                <li><a>Blog</a></li>
                <li><a>Contact</a></li>
            </ul>
        </nav>

    );
};

export default NavMenu;