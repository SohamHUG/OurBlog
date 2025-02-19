import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const UpdateEmail = ({
    user,
    formUser,
    handleChange
}) => {
    const [updateEmail, setUpdateEmail] = useState(false);
    const location = useLocation()


    const openUpdateEmail = () => {
        setUpdateEmail(true);
    }

    const closeUpdateEmail = () => {
        setUpdateEmail(false);
        formUser.newEmail = '';
    }

    // console.log(formUser)

    return (
        <div>

            {!updateEmail ?
                <p className='link'
                    onClick={location.pathname.startsWith('/admin/user') || user && user.is_verified !== 0 ?
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
                        <input type="email" id='newEmail' name="newEmail" value={formUser.newEmail} onChange={handleChange} />

                    </div>
                    <p className="link alert" onClick={closeUpdateEmail}>Annuler</p>
                </div>


            }

        </div>
    );
};

export default UpdateEmail;