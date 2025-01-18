import { deleteUserById, findByCredentials, findUserById, updateUserById } from "../models/user.model.js";
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

    const userLog = await findByCredentials(email);
    // console.log(userLog)

    if (!userLog || userLog.length <= 0) {
        return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    const user = await findUserById(id);
    // console.log(user)

    let roleId = user.role_id

    if (firstName.length <= 0 || lastName.length <= 0) {
        firstName = null;
        lastName = null;
        roleId = 1; // User
    } else {
        roleId = 3; //Author
    }

    if (oldPassword && newPassword) {
        // console.log(req.body)
        if (oldPassword.length < 6 || newPassword.length < 6) {
            return res.status(400).json({ message: "Les mots de passe doivent contenir au moins 6 caractères." });
        }

        const verifyOldPassword = bcrypt.compareSync(oldPassword, userLog[0].password);
        if (!verifyOldPassword) {
            return res.status(401).json({ message: "L'ancien mot de passe est incorrect." });
        }

        const hashedPassword = bcrypt.hashSync(newPassword, 10);
        userLog[0].password = hashedPassword; // Prépare la mise à jour
    }

    const updatedUser = {
        first_name: firstName ,
        last_name: lastName ,
        pseudo: pseudo || user.pseudo,
        email: email || user.email,
        // profil_picture: user.profil_picture,
        password: userLog[0].password, // Utilise le mot de passe actuel ou mis à jour
    };

    await updateUserById(id, updatedUser);

    const newUser = await findUserById(userId)

    return res.status(200).json({ message: "Informations mises à jour avec succès.", user: newUser });
}

export const deleteUser = async (req, res) => {
    const { id } = req.params;
    const user = req.user;

    if (parseInt(id) !== user.user_id && req.user.role_name !== "admin") {
        return res.status(403).json({ message: "Vous n'êtes pas autorisé" });
    }

    await deleteUserById(id);

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    return res.status(200).json({ message: "Utilisateur supprimé" });
}