import * as React from 'react';
import * as Redux from 'react-redux';
import { loginUser, registerUser } from '../../store/slice/authSlice';
import { useNavigate, Navigate } from 'react-router-dom';
import Modal from '../../components/Modal/Modal';
import UserForm from '../../components/UserForm/UserForm';

const RegisterPage = () => {
    // const { user } = Redux.useSelector((state) => state.users);
    // console.log(user)
    // if (user && user.user_id) {
    //     return <Navigate to="/" />;
    // }

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
            dispatch(loginUser({ email: formUser.email, password: formUser.password }));
            setOpenModal(true);
        }
    };

    const closeModal = () => {
        setOpenModal(false);
        navigate('/');
    }

    return (
        <section>
            <UserForm
                formUser={formUser}
                handleSubmit={handleSubmit}
                handleChange={handleChange}
                errorMessage={errorRegister}
            // user={null}
            />

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
        </section>
    );
}

export default RegisterPage;