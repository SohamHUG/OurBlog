import * as React from 'react';
import * as Redux from 'react-redux';
import { useNavigate, Navigate } from 'react-router-dom';
import { updateUser, uploadProfilPic, deleteUser } from '../../store/slice/userSlice';
import Modal from '../../components/Modal/Modal';

const ProfilPage = () => {
    const { user } = Redux.useSelector((state) => state.users);
    if (!user || !user.user_id) {
        return <Navigate to="/" />;
    }

    const dispatch = Redux.useDispatch();
    const navigate = useNavigate();
    const [openModalInfo, setOpenModalInfo] = React.useState(false);
    const [openModalConfirm, setOpenModalConfirm] = React.useState(false);
    const [updatePassword, setUpdatePassword] = React.useState(false);
    const { status, errorUpdate, errorDelete } = Redux.useSelector((state) => state.users);


    const [formUser, setFormUser] = React.useState({
        firstName: user.first_name,
        lastName: user.last_name,
        pseudo: user.pseudo,
        email: user.email,
        oldPassword: '',
        newPassword: '',
    });

    const [profilPicture, setProfilPicture] = React.useState(null);
    // console.log(profilPicture)

    const handleChange = (e) => {
        if (e.target.name === 'profilPicture') {
            setProfilPicture(e.target.files[0]); // Gère le fichier séparément
        } else {
            setFormUser({ ...formUser, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = await dispatch(updateUser({ id: user.user_id, userData: formUser }));

        if (profilPicture) {
            const formData = new FormData();
            formData.append('profilPicture', profilPicture);
            dispatch(uploadProfilPic(formData));
        }

        if (updateUser.fulfilled.match(data)) {
            setOpenModalInfo(true)
        }

    };

    const toggleUpdatePassword = () => {
        setUpdatePassword(!updatePassword);
    }

    const closeModalInfo = () => {
        setOpenModalInfo(false);
    }

    const toggleModalConfirm = () => {
        setOpenModalConfirm(!openModalConfirm);
    }

    const confirmDeleteUser = async () => {
        dispatch(deleteUser(user.user_id));
        navigate('/');
        setOpenModalConfirm(false);

    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <h2>Votre profil</h2>
                {errorUpdate && <p style={{ color: 'red' }}>{errorUpdate}</p>}
                {user.is_verified === 0 && <p style={{ color: 'red' }}>Si vous souhaitez modifier votre profil, merci de verifier votre adresse email</p>}
                <label>
                    Photo de profil:
                    <input
                        type="file"
                        name="profilPicture"
                        accept="image/png, image/jpeg"
                        onChange={handleChange}
                        disabled={user.is_verified === 0}
                    />
                </label>
                <label>
                    Prénom:
                    <input type="text" name="firstName" value={formUser.firstName} onChange={handleChange} disabled={user.is_verified === 0} />
                </label>
                <label>
                    Nom:
                    <input type="text" name="lastName" value={formUser.lastName} onChange={handleChange} disabled={user.is_verified === 0} />
                </label>
                <label>
                    Pseudo:
                    <input type="text" name="pseudo" value={formUser.pseudo} onChange={handleChange} required disabled={user.is_verified === 0} />
                </label>
                <label>
                    Email:
                    <input type="email" name="email" value={formUser.email} disabled />
                </label>
                {!updatePassword ?
                    <p
                        className='link'
                        onClick={
                            user.is_verified !== 0 ?
                                toggleUpdatePassword : null
                        }
                    >
                        Modifier votre mot de passe
                    </p>
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
                <button type="submit" disabled={user.is_verified === 0}>
                    Enregistrer
                </button>

            </form>
            <br></br>
            <button onClick={toggleModalConfirm}>
                Supprimer le compte
            </button>
            {
                openModalInfo &&
                <Modal
                    title="Informations sauvegardées"
                    content={<p>Votre profil à bien été modifié :</p>}
                    validButton='Ok'
                    open={openModalInfo}
                    cancel={closeModalInfo}
                    valid={closeModalInfo}
                />
            }

            {
                openModalConfirm &&
                <Modal
                    title="Êtes vous sûr ?"
                    content={
                        <div>
                            {errorDelete && <p style={{ color: 'red' }}>{errorDelete}</p>}
                            <p>Voulez-vous vraiment <strong style={{ color: 'red' }}>supprimer</strong> votre compte de manière <strong style={{ color: 'red' }}>définitive</strong> ?</p>
                            <strong style={{ color: 'red' }}>Cet action est irréversible !</strong>
                        </div>
                    }
                    validButton='Oui je suis sûr'
                    cancelButton='Annuler'
                    open={openModalConfirm}
                    cancel={toggleModalConfirm}
                    valid={confirmDeleteUser}
                />
            }
        </>
    );
}

export default ProfilPage;