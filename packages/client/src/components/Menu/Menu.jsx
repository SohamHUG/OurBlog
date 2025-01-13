import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import CategoryIcon from "@mui/icons-material/Category";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ArticleIcon from '@mui/icons-material/Article';
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";

const Menu = ({ menuActive, menuRef, user, openModalLogin, handleLogout, darkMode, handleToggleDarkMode }) => {

    return (
        <div className={`menu ${menuActive ? "open" : ""}`} ref={menuRef}>
            <NavLink to={'/categories'} className="menu-link">
                <CategoryIcon className="icon" />
                <p>Les catégories</p>
            </NavLink>

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

            {user && user.role_id === 'admin' && (
                <NavLink to={'/admin'} className="menu-link">
                    <DashboardIcon className="icon" />
                    <p>Dashboard Admin</p>
                </NavLink>
            )}

            {(user && (user.role_id === 'author' || user.role_id === 'admin')) && (
                <NavLink to={'/article/create'} className="menu-link">
                    <ArticleIcon className="icon" />
                    <p>Publier un article</p>
                </NavLink>
            )}

            {!user ? (
                <span onClick={openModalLogin} className="menu-link">
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
