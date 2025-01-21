import React from "react";
import { NavLink } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Modal from "../Modal/Modal";
import LoginForm from "../LoginForm/LoginForm";
import { logout } from "../../store/slice/authSlice";
import { toggleDarkMode } from "../../store/slice/themeSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectDarkMode } from "../../store/selectors";
import Menu from "../Menu/Menu";
import { useNavigate } from 'react-router-dom';
import "./NavBar.scss";

const NavBar = () => {
    const dispatch = useDispatch();
    const darkMode = useSelector(selectDarkMode);
    const [searchActive, setSearchActive] = React.useState(false);
    const [menuActive, setMenuActive] = React.useState(false);
    const searchRef = React.useRef(null);
    const menuRef = React.useRef(null);
    const [openLogin, setOpenLogin] = React.useState(false);
    const user = useSelector((state) => state.users.user);
    const navigate = useNavigate();

    const handleToggleDarkMode = () => {
        dispatch(toggleDarkMode());
    };

    const toggleSearch = () => {
        setSearchActive(!searchActive);
        if (menuActive) {
            setMenuActive(false);
        }
    };

    const toggleMenu = () => {
        setMenuActive(!menuActive);
    };

    const openModalLogin = () => {
        setOpenLogin(true);
    };

    const closeModalLogin = () => {
        setOpenLogin(false);
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target)
            ) {
                setSearchActive(false);
            }
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target) &&
                !event.target.closest(".menu-icon") ||
                menuRef.current.contains(event.target)
            ) {
                setMenuActive(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [searchRef, menuRef]);

    return (
        <>
            <nav className={`main-nav ${searchActive ? "active" : ""}`}>
                <NavLink className={"logo"} to={"/"}>
                    OurBlog
                </NavLink>

                <div className="icons-nav">
                    <label
                        className="search"
                        onClick={toggleSearch}
                        htmlFor="search-bar"
                    >
                        <SearchIcon fontSize="large" />
                    </label>

                    <input
                        type="text"
                        id="search-bar"
                        className="search-bar"
                        placeholder="Rechercher..."
                        ref={searchRef}
                    />
                </div>

                <div className="menu-login">
                    {!user ? (
                        <button onClick={openModalLogin}>Se&nbsp;connecter</button>
                    ) :
                        user.profil_picture ?
                            (
                                <NavLink to={'/profil'}>
                                    <img src={user.profil_picture} alt="" />
                                </NavLink>
                            )
                            :
                            (
                                <NavLink to={'/profil'}>
                                    <AccountCircleIcon fontSize="large" />
                                </NavLink>
                            )
                    }

                    <div className="menu-icon" onClick={toggleMenu}>
                        <MenuIcon fontSize="large" />
                    </div>
                </div>
            </nav>

            <Menu
                menuActive={menuActive}
                menuRef={menuRef}
                user={user}
                openModalLogin={openModalLogin}
                handleLogout={handleLogout}
                darkMode={darkMode}
                handleToggleDarkMode={handleToggleDarkMode}
            />

            {openLogin && (
                <Modal
                    title="Se connecter"
                    content={<LoginForm closeModal={closeModalLogin} />}
                    open={openLogin}
                    cancel={closeModalLogin}
                />
            )}
        </>
    );
};

export default NavBar;
