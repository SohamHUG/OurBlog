import * as React from 'react';
import * as Redux from 'react-redux';
import { loginUser, registerUser } from '../../store/slice/authSlice';
import { useNavigate, Navigate } from 'react-router-dom';
import { updateUser } from '../../store/slice/userSlice';

const ProfilPage = () => {
    const { user } = Redux.useSelector((state) => state.users);
    if (!user || !user.user_id) {
        return <Navigate to="/" />;
    }

    const dispatch = Redux.useDispatch();
    const navigate = useNavigate()
    const [updatePassword, setUpdatePassword] = React.useState(false);
    const { status, errorUpdate } = Redux.useSelector((state) => state.users);


    const [formUser, setFormUser] = React.useState({
        firstName: user.first_name,
        lastName: user.last_name,
        pseudo: user.pseudo,
        email: user.email,
        oldPassword: '',
        newPassword: '',
    });

    const handleChange = (e) => {
        setFormUser({ ...formUser, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(updateUser({ id: user.user_id, userData: formUser }))
    };

    const toggleUpdatePassword = () => {
        setUpdatePassword(!updatePassword);
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>Votre profil</h2>
            {errorUpdate && <p style={{ color: 'red' }}>{errorUpdate}</p>}
            <label>
                Prénom:
                <input type="text" name="firstName" value={formUser.firstName} onChange={handleChange} />
            </label>
            <label>
                Nom:
                <input type="text" name="lastName" value={formUser.lastName} onChange={handleChange} />
            </label>
            <label>
                Pseudo:
                <input type="text" name="pseudo" value={formUser.pseudo} onChange={handleChange} required />
            </label>
            <label>
                Email:
                <input type="email" name="email" value={formUser.email} disabled />
            </label>
            {!updatePassword ?
                <p className='link' onClick={toggleUpdatePassword}>Modifier votre mot de passe</p>
                :
                <div>
                    <label>
                        Mot de passe actuel:
                        <input type="password" name="oldPassword" value={formUser.oldPassword} onChange={handleChange} />

                    </label>
                    <label>
                        Nouveau mot de passe :
                        <input type="password" name="newPassword" value={formUser.newPassword} onChange={handleChange} />

                    </label>
                    <button onClick={toggleUpdatePassword}>Annuler</button>
                </div>
            }
            <button type="submit">
                Enregistrer
            </button>
        </form>
    );
}

export default ProfilPage;