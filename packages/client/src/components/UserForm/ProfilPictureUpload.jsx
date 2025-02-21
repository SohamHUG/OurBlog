import React from 'react';
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useLocation } from 'react-router-dom';

const ProfilPictureUpload = ({
    user,
    previewImage,
    handleChange,
    deleteProfilPicture
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
                disabled={location.pathname.startsWith('/admin/user') || user && user.is_verified === 0 ? true : false}
            />
            {user.profil_picture &&
                <span onClick={deleteProfilPicture} className='link alert'>
                    Supprimer la photo de profil
                </span>
            }
        </div>

    );
};

export default ProfilPictureUpload;