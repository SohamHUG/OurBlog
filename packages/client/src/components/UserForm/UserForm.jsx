import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendEmailConfirm } from '../../store/slice/authSlice';
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import HourglassFullRoundedIcon from '@mui/icons-material/HourglassFullRounded';
import './UserForm.scss'

const UserForm = (props) => {
    const { status } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    // console.log(status)

    const handleEmailConfirm = () => {
        if (status === 'idle') {
            dispatch(sendEmailConfirm());
        }

    }

    return (
        <div className='user-form'>
            <form onSubmit={props.handleSubmit}>
                <h2 className='user-title'>{props.user ? 'Votre profil' : "S'inscrire"}</h2>
                {props.errorMessage && <p className='alert'>{props.errorMessage}</p>}
                {props.user && props.user.is_verified === 0 &&
                    <p className='verif-email-infos'>
                        <span className='alert'>Si vous souhaitez modifier votre profil, merci de verifier votre adresse email. </span>
                        <small style={{ textDecoration: 'underline' }} onClick={handleEmailConfirm} className='link'>Renvoyer l'email de confirmation</small>
                        {status === 'loading' &&
                            <span style={{ color: 'orange' }}>
                                <HourglassFullRoundedIcon />
                            </span>
                        }
                        {status === 'succeeded' &&
                            <span style={{ color: 'green' }}>
                                <CheckCircleRoundedIcon />
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
                            disabled={props.user && props.user.is_verified === 0 ? true : false}
                        />
                    </div>
                }
                <div className='names-container'>
                    <div className='input-label-container'>
                        <label>Prénom:</label>
                        <input type="text" name="firstName"
                            value={props.formUser.firstName}
                            onChange={props.handleChange}
                            disabled={props.user && props.user.is_verified === 0 ? true : false}
                        />
                    </div>
                    <div className='input-label-container'>
                        <label>Nom:</label>
                        <input type="text" name="lastName"
                            value={props.formUser.lastName} onChange={props.handleChange}
                            disabled={props.user && props.user.is_verified === 0 ? true : false}
                        />
                    </div>
                </div>

                <div className='input-label-container'>
                    <label>Pseudo{!props.user && '*'}:</label>
                    <input type="text" name="pseudo"
                        value={props.formUser.pseudo}
                        onChange={props.handleChange}
                        required
                        disabled={props.user && props.user.is_verified === 0 ? true : false}
                    />
                </div>
                <div className='input-label-container'>
                    <label>Email{!props.user && '*'}:</label>
                    <input type="email" name="email"
                        onChange={props.handleChange}
                        value={props.formUser.email}
                        disabled={props.user ? true : false}
                        required
                    />
                </div>

                {!props.user &&
                    <div className='input-label-container'>
                        <label htmlFor="">Mot de passe *:</label>
                        <input type="password" name="password" value={props.formUser.password} onChange={props.handleChange} required />
                    </div>
                }
                {props.user ?
                    !props.updatePassword ?
                        <p className='link'
                            onClick={props.user && props.user.is_verified !== 0 ?
                                props.toggleUpdatePassword
                                :
                                null
                            }
                        >
                            Modifier votre mot de passe
                        </p>
                        :
                        <div>
                            <div className='input-label-container'>
                                <label htmlFor="">Mot de passe actuel:</label>
                                <input type="password" name="oldPassword" value={props.formUser.oldPassword} onChange={props.handleChange} />

                            </div>
                            <div className='input-label-container'>
                                <label htmlFor="">Nouveau mot de passe :</label>
                                <input type="password" name="newPassword" value={props.formUser.newPassword} onChange={props.handleChange} />

                            </div>
                            <p className="link alert" onClick={props.toggleUpdatePassword}>Annuler</p>
                        </div>

                    : ''
                }
                {props.user &&
                    <p className='link alert' onClick={props.toggleModalConfirm}>
                        Supprimer le compte
                    </p>
                }

                <div className='form-footer'>
                    <button type="submit" disabled={props.user && props.user.is_verified === 0 ? true : false}>
                        {props.user ? 'Enregistrer' : "S'inscrire"}
                    </button>

                </div>


            </form>

        </div>
    );
};

export default UserForm;