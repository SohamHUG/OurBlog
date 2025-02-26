import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import './UserForm.scss';
import { useLocation } from 'react-router-dom';
import ProfilPictureUpload from './ProfilPictureUpload';
import ConfirmEmailPassword from './ConfirmEmailPassword';
import UpdateEmail from './UpdateEmail';
import UpdatePassword from './UpdatePassword';
import UpdateRole from './UpdateRole';

const UserForm = (props) => {
    const location = useLocation()


    const formType = location.pathname.startsWith('/admin/user')
        ? 'admin' :
        props.user
            ? 'update'
            : 'signup';

    // console.log(props.user)
    return (
        <div className='user-form'>
            <form onSubmit={props.handleSubmit}>
                
                {(formType === 'update' || formType === 'admin') &&
                    <ProfilPictureUpload {...props} />
                }
                {!props.user || (props.user && !props.user.first_name && !props.user.last_name) ?
                    <small>Entrez votre <strong>nom ET prénom</strong> pour demander à devenir auteur</small>
                    : props.user && props.user.first_name && props.user.last_name && props.user.role_name !== 'author' && props.user.role_name !== 'admin' && 
                    <small>Votre demande pour devenir auteur est en cours de traitement, revenez plus tard</small>
                }
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

                {formType === 'signup' &&
                    <ConfirmEmailPassword {...props} />
                }

                {(formType === 'update' || formType === 'admin') &&
                    <UpdateEmail {...props} />
                }

                {formType === 'update' &&
                    <UpdatePassword {...props} />
                }

                {formType === 'admin' &&
                    <UpdateRole {...props} />
                }

                {(formType === 'update' || formType === 'admin') &&
                    <p className='link alert' onClick={props.toggleModalConfirm}>
                        Supprimer le compte
                    </p>
                }

                <div className='form-footer'>
                    {props.isLoading &&
                        <CircularProgress />
                    }
                    {props.errorMessage && <p className='alert'>{props.errorMessage}</p>}
                    <button type="submit"
                        // disabled={
                        //     (props.user && props.user.is_verified === 0 && !location.pathname.startsWith('/admin/user')) ||
                        //     !props.formUser.pseudo ||
                        //     !props.formUser.email ||
                        //     props.isLoading ||
                        //     (!props.user && (!props.formUser.email2 || !props.formUser.password || !props.formUser.password2))
                        // }
                    >
                        {props.user ? 'Enregistrer' : "S'inscrire"}
                    </button>

                </div>


            </form>

        </div>
    );
};

export default UserForm;