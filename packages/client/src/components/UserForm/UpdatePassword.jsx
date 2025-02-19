import React, { useState } from 'react';

const UpdatePassword = ({
    formUser,
    handleChange,
    handleSubmit,
    user
}) => {
    const [updatePassword, setUpdatePassword] = useState(false);

    const openUpdatePassword = () => {
        setUpdatePassword(true);
    }

    const closeUpdatePassword = () => {
        setUpdatePassword(false);
        formUser.oldPassword = ''
        formUser.newPassword = ''
    }



    return (
        <div>

            {!updatePassword ?
                <p className='link'
                    onClick={user && user.is_verified !== 0 ?
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
                        <input type="password" id='oldPassword' name="oldPassword" value={formUser.oldPassword} onChange={handleChange} />

                    </div>
                    <div className='input-label-container'>
                        <label htmlFor="newPassword">Nouveau mot de passe :</label>
                        <input type="password" id='newPassword' name="newPassword" value={formUser.newPassword} onChange={handleChange} />

                    </div>
                    <p className="link alert" onClick={closeUpdatePassword}>Annuler</p>
                </div>

            }

        </div>
    );
};

export default UpdatePassword;