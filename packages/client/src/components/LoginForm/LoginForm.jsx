import * as React from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { getMe, loginUser } from '../../store/slice/authSlice';

const LoginForm = ({ closeModal }) => {
    const navigate = useNavigate();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const { status, error } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const handleRegisterClick = () => {
        // Fermer la modale
        closeModal();
        // Rediriger vers la page d'inscription
        navigate('/register');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await dispatch(loginUser({ email, password })).unwrap();
            dispatch(getMe());
            closeModal();
        } catch (error) {
            console.error(error.message);
        }

    };

    const borderBot = {
        paddingBottom: '1em',
        borderBottom: '2px solid #235AF3'
    };

    const height100 = {
        height: '100%'
    };

    const flexColumn = {
        display: 'flex',
        flexDirection: 'column'
    };

    return (
        <>
            <div style={height100}>
                <p style={borderBot}>
                    En continuant, vous acceptez nos&ensp;
                    <NavLink
                        className={'link'}
                        to={'/user-agreement'}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Conditions d'utilisation&ensp;
                    </NavLink>
                    et reconnaissez avoir pris connaissance de notre&ensp;
                    <NavLink
                        className={'link'}
                        to={'/privacy-policy'}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Politique de confidentialité
                    </NavLink>.
                </p>

                <form onSubmit={handleSubmit} >
                    <div style={flexColumn}>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        <input
                            type="email"
                            placeholder="Adresse Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div style={flexColumn}>
                        <input
                            type="password"
                            placeholder="Mot de passe"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <p>
                        Première fois sur OurBlog ?&nbsp;
                        <span
                            className="link"
                            onClick={handleRegisterClick}
                        >
                            Inscrivez-vous
                        </span>
                    </p>
                    <div className='modal-footer'>
                        <button type='submit'>
                            Se connecter
                        </button>
                    </div>

                </form>


            </div>

        </>
    );
};

export default LoginForm;
