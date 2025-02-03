import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import CategoryIcon from "@mui/icons-material/Category";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ArticleIcon from '@mui/icons-material/Article';
import DescriptionIcon from '@mui/icons-material/Description';
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useDispatch, useSelector } from "react-redux";
import { selectDarkMode } from "../../store/selectors";
import { toggleDarkMode } from "../../store/slice/themeSlice";
import { openModalLogin, logout } from "../../store/slice/authSlice";

const Menu = ({ menuActive, menuRef }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate()
    const darkMode = useSelector(selectDarkMode);
    const user = useSelector((state) => state.users.user);

    const handleToggleDarkMode = () => {
        dispatch(toggleDarkMode());
    };

    const openLogin = () => {
        dispatch(openModalLogin());
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    return (
        <div className={`menu ${menuActive ? "open" : ""}`} ref={menuRef}>
            <NavLink to={'/categories'} className="menu-link">
                <CategoryIcon className="icon" />
                <p>Les catégories</p>
            </NavLink>



            {user && user.role_name === 'admin' && (
                <NavLink to={'/admin'} className="menu-link">
                    <DashboardIcon className="icon" />
                    <p>Dashboard Admin</p>
                </NavLink>
            )}

            {(user && (user.role_name === 'author' || user.role_name === 'admin')) && (
                <>
                    <NavLink to={'/article/create'} className="menu-link">
                        <ArticleIcon className="icon" />
                        <p>Publier un article</p>
                    </NavLink>

                    <NavLink to={'/author'} className="menu-link">
                        <DescriptionIcon className="icon" />
                        <p>Gérer vos articles</p>
                    </NavLink>
                </>
            )}

            <span className="menu-link">
                <DarkModeIcon />
                <p>
                    <FormControlLabel
                        value="start"
                        control={
                            <Switch
                                color="primary"
                                onChange={handleToggleDarkMode}
                                checked={darkMode}
                            />
                        }
                        label={"Mode sombre"}
                        labelPlacement="start"
                    />
                </p>
            </span>

            {!user ? (
                <span onClick={openLogin} className="menu-link">
                    <LoginIcon className="icon" />
                    <p>Se connecter/S'inscrire</p>
                </span>
            ) : (
                <span onClick={handleLogout} className="menu-link">
                    <LogoutIcon className="icon" />
                    <p className="logout">Déconnexion</p>
                </span>
            )}
        </div>
    );
};

export default Menu;
