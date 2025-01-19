import { findByCredentials, findUserById, updateUserById } from "../models/user.model.js";
import { v2 as cloudinary } from 'cloudinary';
import path from 'path';
import fs from 'fs';


export const uploadProfilPic = async (req, res) => {

    const user = req.user;
    // console.log(req.file);
    if (!req.file) {
        return res.status(400).json({ message: 'Aucun fichier uploadé' });
    }

    // if (user.profil_picture) {
    //     const oldPicturePath = path.join(process.cwd(), '', user.profil_picture);
    //     fs.unlink(oldPicturePath, (err) => {
    //         if (err) console.error(`Erreur lors de la suppression : ${err.message}`);
    //     });
    // }
    if (user.profil_picture_public_id) {
        await cloudinary.uploader.destroy(user.profil_picture_public_id);
    }

    // L'URL du fichier uploadé dans Cloudinary
    const imageUrl = req.file.path;
    const publicId = req.file.filename; // Public ID généré

    // const profilePicturePath = `/uploads/${req.file.filename}`;

    await updateUserById(user.user_id, {
        profil_picture: imageUrl,
        profil_picture_public_id: publicId,
    });

    return res.status(200).json({
        message: 'Photo de profil mise à jour avec succès',
        profilePicture: imageUrl
    });

}

export const deleteProfilPicture = async (req, res) => {
    const { id } = req.params;
    const user = req.user;

    if (parseInt(id) !== user.user_id && req.user.role_name !== "admin") {
        return res.status(403).json({ message: "Vous n'êtes pas autorisé" });
    }

    await cloudinary.uploader.destroy(user.profil_picture_public_id);

    await updateUserById(user.user_id, {
        profil_picture: null,
        profil_picture_public_id: null,
    });

    return res.status(200).json({
        message: 'Photo de profil supprimé avec succès'
    });
}