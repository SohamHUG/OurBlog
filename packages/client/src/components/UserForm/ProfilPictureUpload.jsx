import React from 'react';
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useLocation } from 'react-router-dom';

const ProfilPictureUpload = ({
    user,
    previewImage,
    handleChange
}) => {
    const location = useLocation()

    return (
        <div className='upload-profil-pic'>
            <label htmlFor='profil-file' className='link'>
                {previewImage || user.profil_picture ?
                    <img
                        src={
                            previewImage || user.profil_picture
                        }
                        alt={`Photo de profil de ${user.pseudo}`}
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
                onChange={handleChange}
                disabled={!location.pathname.startsWith('/admin/user') && user && user.is_verified === 0 ? true : false}
            />
        </div>

    );
};

export default ProfilPictureUpload;