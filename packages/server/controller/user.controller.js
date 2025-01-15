import { findByCredentials, findUserById, updateUserById } from "../models/user.model.js";
import bcrypt from 'bcrypt';


export const getUserById = async (req, res) => {
    try {
        const user = req.user;

        return res.status(201).json({ user });
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: err });
    }
}

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.user_id;
    let { firstName, lastName, pseudo, email, oldPassword, newPassword } = req.body;

    if (parseInt(id) !== userId && req.user.role_name !== "admin") {
        return res.status(403).json({ message: "Vous n'êtes pas autorisé" });
    }

    const user = await findByCredentials(email);

    if (!user) {
        return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    if (oldPassword.length > 0 && newPassword.length > 0) {
        if (oldPassword.length < 6 || newPassword.length < 6) {
            return res.status(400).json({ message: "Les mots de passe doivent contenir au moins 6 caractères." });
        }

        const verifyOldPassword = bcrypt.compareSync(oldPassword, user[0].password);
        if (!verifyOldPassword) {
            return res.status(401).json({ message: "L'ancien mot de passe est incorrect." });
        }

        // Hachage du nouveau mot de passe
        const hashedPassword = bcrypt.hashSync(newPassword, 10);
        user[0].password = hashedPassword; // Prépare la mise à jour
    }

    const updatedUser = {
        first_name: firstName || user[0].firstName,
        last_name: lastName || user[0].lastName,
        pseudo: pseudo || user[0].pseudo,
        email: email || user[0].email,
        password: user[0].password, // Utilise le mot de passe actuel ou mis à jour
    };

    await updateUserById(id, updatedUser);

    const newUser = await findUserById(userId)

    return res.status(200).json({ message: "Informations mises à jour avec succès.", user: newUser });

}

export const uploadProfilPic = async (req, res) => {

}