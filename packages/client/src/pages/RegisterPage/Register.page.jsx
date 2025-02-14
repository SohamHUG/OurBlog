import * as React from 'react';
import * as Redux from 'react-redux';
import { loginUser, registerUser } from '../../store/slice/authSlice';
import { useNavigate, Navigate } from 'react-router-dom';
import Modal from '../../components/Modal/Modal';
import UserForm from '../../components/UserForm/UserForm';

const RegisterPage = () => {
    const { user } = Redux.useSelector((state) => state.auth);
    // console.log(user)
    // if (user && user.user_id) {
    //     return <Navigate to="/" />;
    // }

    const dispatch = Redux.useDispatch();
    const navigate = useNavigate();
    const [openModal, setOpenModal] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState('');
    const { status, error } = Redux.useSelector((state) => state.auth);

    const [formUser, setFormUser] = React.useState({
        firstName: '',
        lastName: '',
        pseudo: '',
        email: '',
        email2: '',
        password: '',
        password2: '',
    });

    // console.log(status)

    const handleChange = (e) => {
        setFormUser({ ...formUser, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formUser.pseudo || !formUser.email || !formUser.email2 || !formUser.password || !formUser.password2) {
            setErrorMessage("Tous les champs marqués d'une * sont obligatoires.");
            return;
        }

        if (formUser.email !== formUser.email2) {
            setErrorMessage("Les adresses email ne correspondent pas.");
            return;
        }

        if (formUser.password !== formUser.password2) {
            setErrorMessage("Les mots de passe ne correspondent pas.");
            return;
        }

        setErrorMessage('')
        const result = await dispatch(registerUser(formUser));

        if (registerUser.fulfilled.match(result)) {
            // dispatch(loginUser({ email: formUser.email, password: formUser.password }));
            setOpenModal(true);
        }
    };

    const closeModal = () => {
        setOpenModal(false);
        dispatch(loginUser({ email: formUser.email, password: formUser.password }));
        navigate('/');
    }

    if (user && user.user_id) {
        return <Navigate to="/" />;
    }

    return (
        <section>
            <UserForm
                formUser={formUser}
                handleSubmit={handleSubmit}
                handleChange={handleChange}
                errorMessage={error || errorMessage}
                isLoading={status === 'loading'}
            />

            {openModal &&
                <Modal
                    title="Profil créé"
                    content={<p>Un email de confirmation a été envoyé. Vérifiez votre boîte mail.</p>}
                    validButton='Ok'
                    open={openModal}
                    cancel={closeModal}
                    valid={closeModal}
                />
            }
        </section>
    );
}

export default RegisterPage;