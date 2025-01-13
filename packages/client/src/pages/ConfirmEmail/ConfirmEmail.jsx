import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ConfirmEmail = () => {
    const [status, setStatus] = useState('loading');
    const { token } = useParams(); 

    useEffect(() => {
        const confirmEmail = async () => {
            try {
                const response = await fetch(`http://localhost:3000/auth/confirm/${token}`);
                if (response.ok) {
                    setStatus('success');
                } else {
                    setStatus('error');
                }
            } catch (error) {
                setStatus('error');
            }
        };

        confirmEmail();
    }, [token]);

    return (
        <div>
            {status === 'loading' && <p>Validation en cours...</p>}
            {status === 'success' && <p>Votre email a été confirmé avec succès !</p>}
            {status === 'error' && <p>Le lien de confirmation est invalide ou expiré.</p>}
        </div>
    );
};

export default ConfirmEmail;
