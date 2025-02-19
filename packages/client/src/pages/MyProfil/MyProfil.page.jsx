import * as React from 'react';
import * as Redux from 'react-redux';
import { useNavigate, Navigate } from 'react-router-dom';
import { updateUser, deleteUser } from '../../store/slice/userSlice';
import { uploadProfilPic } from '../../store/slice/photoSlice';
import Modal from '../../components/Modal/Modal';
import UserForm from '../../components/UserForm/UserForm';
import { sendEmailConfirm } from '../../store/slice/authSlice';
import CircularProgress from '@mui/material/CircularProgress';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';


const MyProfilPage = () => {
    const { user } = Redux.useSelector((state) => state.auth);

    const dispatch = Redux.useDispatch();
    const navigate = useNavigate();
    const [openModalInfo, setOpenModalInfo] = React.useState(false);
    const [openModalConfirm, setOpenModalConfirm] = React.useState(false);
    const { status, error } = Redux.useSelector((state) => state.users);
    const statusEmail = Redux.useSelector((state) => state.auth.status);

    const [formUser, setFormUser] = React.useState({
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        pseudo: user.pseudo,
        email: user.email,
        newEmail: '',
        oldPassword: '',
        newPassword: '',
    });

    const [profilPicture, setProfilPicture] = React.useState(null);
    const [previewImage, setPreviewImage] = React.useState(null);

    const handleChange = (e) => {
        if (e.target.name === 'profilPicture') {
            const file = e.target.files[0];
            if (file) {
                // Génère un URL temporaire pour l'aperçu
                const preview = URL.createObjectURL(file);
                setPreviewImage(preview);
            }
            setProfilPicture(file);
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
            console.log("FormData content:", formData.get('profilPicture'));
            dispatch(uploadProfilPic(formData));
            // setPreviewImage(null);
        }

        if (updateUser.fulfilled.match(data)) {
            setOpenModalInfo(true)
            formUser.oldPassword = '';
            formUser.newPassword = '';
        }

    };

    const closeModalInfo = () => {
        setOpenModalInfo(false);
        navigate('/')
    }

    const toggleModalConfirm = () => {
        setOpenModalConfirm(!openModalConfirm);
    }

    const confirmDeleteUser = async () => {
        dispatch(deleteUser(user.user_id));
        navigate('/');
        setOpenModalConfirm(false);

    }

    const deleteProfilPicture = async () => {

    }

    const handleEmailConfirm = () => {
        // if (statusEmail === 'idle') {
        dispatch(sendEmailConfirm());
        // }

    }

    return (
        <section>
            <h2 className='user-title'>Votre profil</h2>
            {user && user.is_verified === 0 &&
                <p className='verif-email-infos'>
                    <span className='alert'>Si vous souhaitez modifier votre profil, merci de verifier votre adresse email. </span>
                    <small style={{ textDecoration: 'underline' }} onClick={handleEmailConfirm} className='link'>Renvoyer l'email de confirmation</small>
                    {statusEmail === 'loading' &&
                        <span>
                            <CircularProgress size="25px" />
                        </span>
                    }
                    {statusEmail === 'succeeded' &&
                        <span style={{ color: 'green' }}>
                            <CheckCircleRoundedIcon fontSize="medium" />
                        </span>
                    }
                    {statusEmail === 'failed' &&
                        <span className='alert'>
                            Error
                        </span>
                    }
                </p>

            }
            <UserForm
                user={user}
                formUser={formUser}
                handleSubmit={handleSubmit}
                handleChange={handleChange}
                errorMessage={error}
                // toggleUpdatePassword={toggleUpdatePassword}
                // updatePassword={updatePassword}
                isLoading={status === 'loading'}
                toggleModalConfirm={toggleModalConfirm}
                previewImage={previewImage}

            />
            {openModalInfo &&
                <Modal
                    title="Informations sauvegardées"
                    content={<p>Votre profil à bien été modifié :</p>}
                    validButton='Ok'
                    open={openModalInfo}
                    cancel={closeModalInfo}
                    valid={closeModalInfo}
                />
            }

            {openModalConfirm &&
                <Modal
                    title="Êtes vous sûr ?"
                    content={
                        <div>
                            {error && <p style={{ color: 'red' }}>{error}</p>}
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
        </section>
    );
}

export default MyProfilPage;