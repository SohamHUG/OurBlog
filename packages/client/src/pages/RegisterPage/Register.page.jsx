import * as React from 'react';
import * as Redux from 'react-redux';
import { loginUser, registerUser } from '../../store/slice/authSlice';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const dispatch = Redux.useDispatch();
    const navigate = useNavigate()
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
            // console.log(result.payload.newUser.user_id);
            dispatch(loginUser({ email: formUser.email, password: formUser.password }));
            alert('Un email de confirmation a été envoyé. Vérifiez votre boîte mail.');
            navigate('/');
        } 
    };

    return (
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
            <button type="submit" disabled={status === 'loading'}>
                S'incrire
            </button>
        </form>
    );
}

export default RegisterPage;