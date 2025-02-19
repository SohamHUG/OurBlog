import React from 'react';

const ConfirmEmailPassword = ({
    handleChange,
    formUser,
}) => {

    return (
        <div >
            <div className='input-label-container'>
                <label htmlFor='email2'>Confirmer l'email*:</label>
                <input type="email" name="email2" id='email2'
                    onChange={handleChange}
                    value={formUser.email2}
                    autoComplete='off'
                    required
                />
            </div>

            <div className='input-label-container'>
                <label htmlFor="password">Mot de passe*:</label>
                <input type="password" id='password' name="password" value={formUser.password} onChange={handleChange} required />
            </div>

            <div className='input-label-container'>
                <label htmlFor="password2">Confirmer le mot de passe*:</label>
                <input type="password" id='password2' name="password2" value={formUser.password2} onChange={handleChange} required />
            </div>

        </div>
    );
};

export default ConfirmEmailPassword;