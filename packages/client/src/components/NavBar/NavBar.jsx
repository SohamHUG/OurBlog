import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Modal from "../Modal/Modal";
import LoginForm from "../LoginForm/LoginForm";
import { logout, openModalLogin, closeModalLogin } from "../../store/slice/authSlice";
import { toggleDarkMode } from "../../store/slice/themeSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectDarkMode } from "../../store/selectors";
import Menu from "../Menu/Menu";
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash.debounce';
import SearchResultsNav from "../SearchResults/SearchResultsNav";
import "./NavBar.scss";
import { fetchSearchResultsNav, clearSearch, clearNavSearch } from "../../store/slice/searchSlice";

const NavBar = () => {
    const dispatch = useDispatch();
    const location = useLocation()
    const [searchActive, setSearchActive] = React.useState(false);
    const [menuActive, setMenuActive] = React.useState(false);
    const searchRef = React.useRef(null);
    const menuRef = React.useRef(null);
    const user = useSelector((state) => state.auth.user);
    const { modalLogin } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = React.useState('');
    const searchResults = useSelector((state) => state.search.navResults);

    const debouncedSearch = React.useMemo(
        () => debounce((query) => dispatch(fetchSearchResultsNav({ query })), 300),
        [dispatch]
    );

    React.useEffect(() => {
        if (searchQuery.trim() === '') {

            dispatch(clearNavSearch());
        } else {
            debouncedSearch(searchQuery);
        }
        return () => debouncedSearch.cancel();
    }, [searchQuery]);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        if (searchQuery.trim() === '') return;
        
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        setSearchQuery('')
        dispatch(clearNavSearch())
        setSearchActive(false);

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

    const openLogin = () => {
        dispatch(openModalLogin());
    };

    const closeLogin = () => {
        dispatch(closeModalLogin());
    };

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target) && 
                !event.target.closest("form")
            ) {
                setSearchActive(false);
                setSearchQuery('')
                dispatch(clearNavSearch())
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

                <form onSubmit={handleSearchSubmit} className="icons-nav">
                    <label
                        className="search"
                        onClick={toggleSearch}
                        htmlFor="search-bar"
                    >
                        <SearchIcon fontSize="large" />
                    </label>

                    <div>
                        <input
                            type="text"
                            id="search-bar"
                            autoComplete="off"
                            className="search-bar"
                            placeholder="Rechercher..."
                            ref={searchRef}
                            value={searchQuery}
                            onChange={handleSearchChange}

                        />
                        <button className="submit-search" type="submit">
                            <SearchIcon fontSize="medium" />
                        </button>
                    </div>
                </form>
                <SearchResultsNav
                    className="search-results"
                    results={searchResults}
                    searchRef={searchRef}
                />
                <div className="menu-login">
                    {!user ? (
                        <button onClick={openLogin}>Se&nbsp;connecter</button>
                    ) :
                        user.profil_picture ?
                            (
                                <NavLink to={'/profil'}>
                                    <img className="avatar" src={user.profil_picture} alt={`Photo de profil de ${user.first_name} ${user.last_name}`} />
                                </NavLink>
                            )
                            :
                            (
                                <NavLink to={'/profil'}>
                                    <AccountCircleIcon className="default-avatar" fontSize="large" />
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
            />

            {modalLogin && (
                <Modal
                    title="Se connecter"
                    content={<LoginForm closeModal={closeLogin} />}
                    open={openLogin}
                    cancel={closeLogin}
                />
            )}
        </>
    );
};



export default NavBar;
