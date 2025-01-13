import * as React from 'react';
import * as Redux from 'react-redux';
import { loginUser, registerUser } from '../../store/slice/authSlice';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const dispatch = Redux.useDispatch();
    const navigate = useNavigate()
    const { status, error } = Redux.useSelector((state) => state.auth);

    const [formData, setFormData] = React.useState({
        firstName: '',
        lastName: '',
        pseudo: '',
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(registerUser(formData));

        // Si l'inscription réussit, on tente de se connecter
        if (registerUser.fulfilled.match(result)) {
            // dispatch(loginUser({ email: formData.email, password: formData.password }));
            alert('Un email de confirmation a été envoyé. Vérifiez votre boîte mail.');
            navigate('/');
            
        } 
        // else {
        //     console.error("Registration failed:", result.payload || result.error.message);
        // }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>S'inscrire</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <label>
                Prénom:
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
            </label>
            <label>
                Nom:
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
            </label>
            <label>
                Pseudo*:
                <input type="text" name="pseudo" value={formData.pseudo} onChange={handleChange} required />
            </label>
            <label>
                Email*:
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </label>
            <label>
                Mot de passe *:
                <input type="password" name="password" value={formData.password} onChange={handleChange} required />
            </label>
            <button type="submit" disabled={status === 'loading'}>
                S'incrire
            </button>
        </form>
    );
}

export default RegisterPage;