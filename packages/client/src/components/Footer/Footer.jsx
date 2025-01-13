import { NavLink, useLocation } from "react-router-dom";
import './Footer.scss'
import EmailIcon from '@mui/icons-material/Email';

const Footer = () => {

    return (
        <>
            <footer className="footer">
                <NavLink className={'logo'} to={'/'}>
                    OurBlog
                </NavLink>

                <nav className="footer-nav">
                    <div className="nav-left">
                        <ul>
                            <li>A propos</li>
                            <li>Politique de confidentialité</li>
                            <li>Conditions d'utilisation</li>
                            <li>FAQ</li>
                            <li>Cookies</li>
                        </ul>
                    </div>

                    <div className="nav-right">
                        <ul>
                            <li>Accueil</li>
                            <li>Catégories</li>
                            <li>Connexion</li>
                            <li>Inscription</li>
                            <li>Paramètres</li>
                        </ul>

                    </div>
                </nav>

                <button className="contact">
                    <span>Nous contacter </span>
                    <EmailIcon fontSize="small" />
                </button>


            </footer>

        </>
    );
};

export default Footer;