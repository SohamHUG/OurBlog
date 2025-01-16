import * as React from 'react';
import * as Redux from 'react-redux';
import { loginUser, registerUser } from '../../store/slice/authSlice';
import { useNavigate } from 'react-router-dom';
import Modal from '../../components/Modal/Modal';

const RegisterPage = () => {
    const dispatch = Redux.useDispatch();
    const navigate = useNavigate();
    const [openModal, setOpenModal] = React.useState(false)
    const { status, errorRegister } = Redux.useSelector((state) => state.auth);

    const [formUser, setFormUser] = React.useState({
        firstName: '',
        lastName: '',
        pseudo: '',
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        setFormUser({ ...formUser, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(registerUser(formUser));

        if (registerUser.fulfilled.match(result)) {
            // console.log(result.payload.newUser);
            dispatch(loginUser({ email: formUser.email, password: formUser.password }));

            setOpenModal(true);
            // navigate('/');
        }
    };

    const closeModal = () => {
        setOpenModal(false);
        navigate('/');
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <h2>S'inscrire</h2>
                {errorRegister && <p style={{ color: 'red' }}>{errorRegister}</p>}
                <label>
                    Prénom:
                    <input type="text" name="firstName" value={formUser.firstName} onChange={handleChange} />
                </label>
                <label>
                    Nom:
                    <input type="text" name="lastName" value={formUser.lastName} onChange={handleChange} />
                </label>
                <label>
                    Pseudo*:
                    <input type="text" name="pseudo" value={formUser.pseudo} onChange={handleChange} required />
                </label>
                <label>
                    Email*:
                    <input type="email" name="email" value={formUser.email} onChange={handleChange} required />
                </label>
                <label>
                    Mot de passe *:
                    <input type="password" name="password" value={formUser.password} onChange={handleChange} required />
                </label>
                <button type="submit">
                    S'incrire
                </button>
            </form>

            {
                openModal &&
                <Modal
                    title="Profil créé"
                    content={<p>Un email de confirmation a été envoyé. Vérifiez votre boîte mail.</p>}
                    validButton='Ok'
                    open={openModal}
                    cancel={closeModal}
                    valid={closeModal}
                />
            }
        </>
    );
}

export default RegisterPage;