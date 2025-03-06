import * as React from 'react';
import * as Redux from 'react-redux';
import { useNavigate, Navigate } from 'react-router-dom';
import { updateUser, deleteUser } from '../../store/slice/userSlice';
import { deleteProfilPic, uploadProfilPic } from '../../store/slice/photoSlice';
import Modal from '../../components/Modal/Modal';
import UserForm from '../../components/UserForm/UserForm';
import { sendEmailConfirm, setErrorMessage, setStatus } from '../../store/slice/authSlice';
import CircularProgress from '@mui/material/CircularProgress';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { getComments } from '../../store/slice/commentSlice';
import CommentsList from '../../components/CommentsList/CommentsList';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { selectAuthError, selectAuthStatus, selectComments, selectPhotosStatus, selectUser, selectUsersError, selectUsersStatus } from '../../store/selectors';


const MyProfilPage = () => {
    const user = Redux.useSelector(selectUser);
    const dispatch = Redux.useDispatch();
    const navigate = useNavigate();
    const [openModalInfo, setOpenModalInfo] = React.useState(false);
    const [openModalConfirm, setOpenModalConfirm] = React.useState(false);
    const status = Redux.useSelector(selectUsersStatus);
    const error = Redux.useSelector(selectUsersError);
    const statusUpload = Redux.useSelector(selectPhotosStatus)
    const statusEmail = Redux.useSelector(selectAuthStatus);
    const errorEmail = Redux.useSelector(selectAuthError);
    const comments = Redux.useSelector(selectComments)
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

    React.useEffect(() => {
        dispatch(setErrorMessage(null))
        dispatch(setStatus('idle'))
    }, [])

    React.useEffect(() => {
        if (user) {
            dispatch(getComments({
                userId: user.user_id
            }))
        }

    }, [user, dispatch])

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

        try {
            if (profilPicture) {
                const formData = new FormData();
                formData.append('profilPicture', profilPicture);
                await dispatch(uploadProfilPic(formData)).unwrap();
            }
            //  else if (previewImage === null) {
            //     await dispatch(updateUser({ id: user.user_id, userData: { ...formUser, deleteProfilPicture: true } })).unwrap();
            // }

            await dispatch(updateUser({ id: user.user_id, userData: formUser })).unwrap();
            setOpenModalInfo(true)
            formUser.oldPassword = '';
            formUser.newPassword = '';

        } catch (error) {
            console.error(error.message)
        }


    };

    const closeModalInfo = () => {
        setOpenModalInfo(false);
        window.location.reload();
        // navigate('/')
    }

    const toggleModalConfirm = () => {
        setOpenModalConfirm(!openModalConfirm);
    }

    const confirmDeleteUser = async () => {
        try {
            await dispatch(deleteUser(user.user_id)).unwrap();
            navigate('/');
            setOpenModalConfirm(false);
        } catch (error) {
            console.error(error.message)
        }

    }

    const deleteProfilPicture = async () => {
        try {
            await dispatch(deleteProfilPic(user.user_id)).unwrap()
            window.location.reload();
        } catch (error) {
            console.error(error.message)
        }
        // navigate('/')
    }

    const handleEmailConfirm = () => {
        dispatch(sendEmailConfirm());

    }

    const header = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '2px solid #ddd',
        width: '100%'
    }

    const h2Style = {
        textAlign: 'center',
        flex: '1',
    }

    return (
        <section>
            <div style={header}>
                <ArrowBackIcon className="back-btn link" onClick={() => navigate(-1)} />
                <h2 style={h2Style}>Votre profil</h2>
            </div>
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
                            {errorEmail}
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
                isLoading={status === 'loading' || statusUpload === 'loading'}
                toggleModalConfirm={toggleModalConfirm}
                previewImage={previewImage}
                deleteProfilPicture={deleteProfilPicture}
            />
            {comments && comments.length > 0 &&
                <div>
                    <h3>Vos commentaires :</h3>
                    <CommentsList comments={comments} />
                </div>

            }
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
                            {error && <p className='alert'>{error}</p>}
                            <p>Voulez-vous vraiment <strong className='alert'>supprimer</strong> votre compte de manière <strong className='alert'>définitive</strong> ?</p>
                            <strong className='alert'>Cet action est irréversible !</strong>
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