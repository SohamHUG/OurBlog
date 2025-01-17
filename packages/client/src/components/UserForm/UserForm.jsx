import * as React from 'react';
import { useSelector } from 'react-redux';
import './UserForm.scss'
const UserForm = (props) => {
    const { user } = useSelector((state) => state.users);
    return (
        <div className='user-form'>
            <form onSubmit={props.handleSubmit}>
                <h2>{props.user ? 'Votre profil' : "S'inscrire"}</h2>
                {props.errorMessage && <p style={{ color: 'red' }}>{props.errorMessage}</p>}
                {props.user && props.user.is_verified === 0 ? <p style={{ color: 'red' }}>Si vous souhaitez modifier votre profil, merci de verifier votre adresse email</p> : ''}
                {props.user &&
                    <div className='upload-profil-pic'>
                        <img src="" alt="" />
                        <label htmlFor='profil-file' className='link'>Photo de profil</label>
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
                <label>
                    Prénom:
                    <input type="text" name="firstName"
                        value={props.formUser.firstName}
                        onChange={props.handleChange}
                        disabled={props.user && props.user.is_verified === 0 ? true : false}
                    />
                </label>
                <label>
                    Nom:
                    <input type="text" name="lastName"
                        value={props.formUser.lastName} onChange={props.handleChange}
                        disabled={props.user && props.user.is_verified === 0 ? true : false}
                    />
                </label>
                <label>
                    Pseudo:
                    <input type="text" name="pseudo"
                        value={props.formUser.pseudo}
                        onChange={props.handleChange} required
                        disabled={props.user && props.user.is_verified === 0 ? true : false}
                    />
                </label>
                <label>
                    Email:
                    <input type="email" name="email"
                        onChange={props.handleChange}
                        value={props.formUser.email}
                        disabled={props.user ? true : false}
                    />
                </label>

                {!props.user &&
                    <label>
                        Mot de passe *:
                        <input type="password" name="password" value={props.formUser.password} onChange={props.handleChange} required />
                    </label>
                }
                {props.user ?
                    !props.updatePassword ?
                        <p
                            className='link'
                            onClick={
                                props.user && props.user.is_verified !== 0 ?
                                    props.toggleUpdatePassword
                                    : null
                            }
                        >
                            Modifier votre mot de passe
                        </p>
                        :
                        <div>
                            <label>
                                Mot de passe actuel:
                                <input type="password" name="oldPassword" value={props.formUser.oldPassword} onChange={props.handleChange} />

                            </label>
                            <label>
                                Nouveau mot de passe :
                                <input type="password" name="newPassword" value={props.formUser.newPassword} onChange={props.handleChange} />

                            </label>
                            <p className="link" style={{ color: 'red' }} onClick={props.toggleUpdatePassword}>Annuler</p>
                        </div>
                    : ''
                }

                <button type="submit" disabled={props.user && props.user.is_verified === 0 ? true : false}>
                    {props.user ? 'Enregistrer' : "S'inscrire"}
                </button>


            </form>
            {props.user &&
                <button onClick={props.toggleModalConfirm}>
                    Supprimer le compte
                </button>
            }
        </div>
    );
};

export default UserForm;