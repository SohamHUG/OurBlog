import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendEmailConfirm } from '../../store/slice/authSlice';
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import HourglassFullRoundedIcon from '@mui/icons-material/HourglassFullRounded';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import './UserForm.scss'
import { useLocation } from 'react-router-dom';

const UserForm = (props) => {
    const { status } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [updatePassword, setUpdatePassword] = React.useState(false);
    const [updateEmail, setUpdateEmail] = React.useState(false);
    const location = useLocation()

    // console.log(location)

    const handleEmailConfirm = () => {
        // if (status === 'idle') {
        dispatch(sendEmailConfirm());
        // }

    }

    const openUpdatePassword = () => {
        setUpdatePassword(true);
    }

    const closeUpdatePassword = () => {
        setUpdatePassword(false);
        props.formUser.oldPassword = ''
        props.formUser.newPassword = ''
    }

    const openUpdateEmail = () => {
        setUpdateEmail(true);
    }

    const closeUpdateEmail = () => {
        setUpdateEmail(false);
        props.formUser.newEmail = '';
    }

    return (
        <div className='user-form'>
            <form onSubmit={props.handleSubmit}>
                {props.errorMessage && <p className='alert'>{props.errorMessage}</p>}
                {props.user && props.user.is_verified === 0 && !location.pathname.startsWith('/admin/user') &&
                    <p className='verif-email-infos'>
                        <span className='alert'>Si vous souhaitez modifier votre profil, merci de verifier votre adresse email. </span>
                        <small style={{ textDecoration: 'underline' }} onClick={handleEmailConfirm} className='link'>Renvoyer l'email de confirmation</small>
                        {status === 'loading' &&
                            <span>
                                <CircularProgress size="25px" />
                            </span>
                        }
                        {status === 'succeeded' &&
                            <span style={{ color: 'green' }}>
                                <CheckCircleRoundedIcon fontSize="medium" />
                            </span>
                        }
                        {status === 'failed' &&
                            <span className='alert'>
                                Error
                            </span>
                        }
                    </p>

                }
                {props.user &&
                    <div className='upload-profil-pic'>
                        <label htmlFor='profil-file' className='link'>
                            {props.previewImage || props.user.profil_picture ?
                                <img
                                    src={
                                        props.previewImage || props.user.profil_picture
                                    }
                                    alt={`Photo de profil de ${props.user.pseudo}`}
                                />
                                : <AccountCircleIcon fontSize='large' />
                            }
                            Choisir une photo de profil
                        </label>
                        <input
                            id='profil-file'
                            className='input-file'
                            type="file"
                            name="profilPicture"
                            accept="image/png, image/jpeg"
                            onChange={props.handleChange}
                            disabled={!location.pathname.startsWith('/admin/user') && props.user && props.user.is_verified === 0 ? true : false}
                        />
                    </div>
                }
                <small>Entrez vos noms et prénoms pour publier des articles</small>
                <div className='names-container'>
                    <div className='input-label-container'>

                        <label htmlFor='firstName'>Prénom:</label>
                        <input type="text" name="firstName" id='firstName'
                            value={props.formUser.firstName}
                            onChange={props.handleChange}
                            disabled={!location.pathname.startsWith('/admin/user') && props.user && props.user.is_verified === 0 ? true : false}
                        />
                    </div>
                    <div className='input-label-container'>
                        <label htmlFor='lastName'>Nom:</label>
                        <input type="text" name="lastName" id='lastName'
                            value={props.formUser.lastName} onChange={props.handleChange}
                            disabled={!location.pathname.startsWith('/admin/user') && props.user && props.user.is_verified === 0 ? true : false}
                        />
                    </div>
                </div>

                <div className='input-label-container'>
                    <label htmlFor='pseudo'>Pseudo{!props.user && '*'}:</label>
                    <input type="text" name="pseudo" id='pseudo'
                        value={props.formUser.pseudo}
                        onChange={props.handleChange}
                        required
                        disabled={!location.pathname.startsWith('/admin/user') && props.user && props.user.is_verified === 0 ? true : false}
                    />
                </div>

                <div className='input-label-container'>
                    <label htmlFor='email'>
                        Email{!props.user && '*'}:
                    </label>
                    <input type="email" name="email" id='email'
                        onChange={props.handleChange}
                        value={props.formUser.email}
                        disabled={props.user ? true : false}
                        required
                    />
                </div>
                {!props.user &&
                    <>
                        <div className='input-label-container'>
                            <label htmlFor='email2'>Confirmer l'email{!props.user && '*'}:</label>
                            <input type="email" name="email2" id='email2'
                                onChange={props.handleChange}
                                value={props.formUser.email2}
                                autoComplete='off'
                                required
                            />
                        </div>
                        {/* // } */}

                        {/* // {!props.user && */}

                        <div className='input-label-container'>
                            <label htmlFor="password">Mot de passe *:</label>
                            <input type="password" id='password' name="password" value={props.formUser.password} onChange={props.handleChange} required />
                        </div>

                        <div className='input-label-container'>
                            <label htmlFor="password2">Confirmer le mot de passe *:</label>
                            <input type="password" id='password2' name="password2" value={props.formUser.password2} onChange={props.handleChange} required />
                        </div>
                    </>
                }
                {props.user ?
                    !updateEmail ?
                        <p className='link'
                            onClick={location.pathname.startsWith('/admin/user') || props.user && props.user.is_verified !== 0 ?
                                openUpdateEmail
                                :
                                null
                            }
                        >
                            Modifier l'email
                        </p>
                        :
                        <div>
                            <div className='input-label-container'>
                                <label htmlFor="newEmail">Nouvelle adresse email :</label>
                                <small>Un email de confirmation sera renvoyé</small>
                                <input type="email" id='newEmail' name="newEmail" value={props.formUser.newEmail} onChange={props.handleChange} />

                            </div>
                            <p className="link alert" onClick={closeUpdateEmail}>Annuler</p>
                        </div>

                    : ''
                }

                {props.user && !location.pathname.startsWith('/admin/user') ?
                    !updatePassword ?
                        <p className='link'
                            onClick={props.user && props.user.is_verified !== 0 ?
                                openUpdatePassword
                                :
                                null
                            }
                        >
                            Modifier votre mot de passe
                        </p>
                        :
                        <div>
                            <div className='input-label-container'>
                                <label htmlFor="oldPassword">Mot de passe actuel:</label>
                                <input type="password" id='oldPassword' name="oldPassword" value={props.formUser.oldPassword} onChange={props.handleChange} />

                            </div>
                            <div className='input-label-container'>
                                <label htmlFor="newPassword">Nouveau mot de passe :</label>
                                <input type="password" id='newPassword' name="newPassword" value={props.formUser.newPassword} onChange={props.handleChange} />

                            </div>
                            <p className="link alert" onClick={closeUpdatePassword}>Annuler</p>
                        </div>

                    : ''
                }
                {props.user &&
                    <p className='link alert' onClick={props.toggleModalConfirm}>
                        Supprimer le compte
                    </p>
                }

                <div className='form-footer'>
                    {props.isLoading &&
                        <CircularProgress />
                    }
                    <button type="submit"
                        disabled={
                            (props.user && props.user.is_verified === 0 && !location.pathname.startsWith('/admin/user')) ||
                            !props.formUser.pseudo ||
                            !props.formUser.email ||
                            props.isLoading ||
                            (!props.user && (!props.formUser.email2 || !props.formUser.password || !props.formUser.password2))
                        }
                    >
                        {props.user ? 'Enregistrer' : "S'inscrire"}
                    </button>

                </div>


            </form>

        </div>
    );
};

export default UserForm;