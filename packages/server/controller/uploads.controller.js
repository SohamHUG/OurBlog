import { findByCredentials, findUserById, updateUserById } from "../models/user.model.js";
import path from 'path';
import fs from 'fs';


export const uploadProfilPic = async (req, res) => {

    const user = req.user;
    // console.log(req.user);
    if (!req.file) {
        return res.status(400).json({ message: 'Aucun fichier uploadé' });
    }

    if (user.profil_picture) {
        const oldPicturePath = path.join(process.cwd(), '', user.profil_picture);
        fs.unlink(oldPicturePath, (err) => {
            if (err) console.error(`Erreur lors de la suppression : ${err.message}`);
        });
    }

    const profilePicturePath = `/uploads/${req.file.filename}`;

    await updateUserById(user.user_id, { profil_picture: profilePicturePath });

    return res.status(200).json({
        message: 'Photo de profil mise à jour avec succès',
        profilePicture: profilePicturePath
    });

}