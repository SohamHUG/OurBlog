import { NavLink, useLocation } from "react-router-dom";
import './Footer.scss'
import EmailIcon from '@mui/icons-material/Email';

const Footer = () => {

    return (
        <footer className="footer">
            <NavLink className={'logo'} to={'/'}>
                OurBlog
            </NavLink>

            <nav className="footer-nav">
                <div className="nav-left">
                    <ul>
                        <li className="link">A propos</li>
                        <li className="link">Politique de confidentialité</li>
                        <li className="link">Conditions d'utilisation</li>
                        <li className="link">FAQ</li>
                        <li className="link">Cookies</li>
                    </ul>
                </div>

                <div className="nav-right">
                    <ul>
                        <li className="link">Accueil</li>
                        <li className="link">Catégories</li>
                        <li className="link">Connexion</li>
                        <li className="link">Inscription</li>
                        <li className="link">Paramètres</li>
                    </ul>

                </div>
            </nav>

            <NavLink to={'/contact'}>
                <button className="contact">
                    <span>Nous contacter </span>
                    <EmailIcon fontSize="small" />
                </button>
            </NavLink>

        </footer>
    );
};

export default Footer;