import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ConfirmEmail = () => {
    const [status, setStatus] = useState('loading');
    const { token } = useParams(); 

    const API_URL = import.meta.env.VITE_API_URL;


    useEffect(() => {
        const confirmEmail = async () => {
            try {
                const response = await fetch(`${API_URL}/auth/confirm/${token}`);
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
