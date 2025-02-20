import { deleteUserById, findAllUsers, findByCredentials, findPopularUsers, findUserById, updateUserById } from "../models/user.model.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { sendConfirmationEmail, sendInfoEmail } from "../utils/index.js";
import { findAllRoles } from "../models/roles.model.js";
import dotenv from 'dotenv';

dotenv.config();


export const getMine = async (req, res) => {
    try {
        const user = req.user;

        const { refresh_token, ...userData } = user;

        // console.log(userData)

        return res.status(201).json({ user: userData });
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: err });
    }
}

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await findUserById(id)

        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        const { refresh_token, ...userData } = user;

        return res.status(201).json({ user: userData });
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: err });
    }
}

export const getUsers = async (req, res) => {
    try {
        const users = await findAllUsers()

        return res.status(201).json({ users });
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: err });
    }
}

export const getPopularUsers = async (req, res) => {
    try {
        const users = await findPopularUsers()
        return res.status(201).json({ users });
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: err });
    }
}

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.user_id;
    let { firstName, lastName, pseudo, email, newEmail, oldPassword, newPassword } = req.body;


    if (parseInt(id) !== userId && req.user.role_name !== "admin") {
        return res.status(403).json({ message: "Vous n'êtes pas autorisé" });
    }

    const userLog = await findByCredentials(email);

    if (!userLog || userLog.length <= 0) {
        return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    const user = await findUserById(id);

    if (newEmail) {
        // console.log(newEmail);
        const emailAlreadyExist = await findByCredentials(newEmail);

        if (emailAlreadyExist && emailAlreadyExist.length > 0) {
            return res.status(400).json({ message: "Cet email est déja utilisé", });
        }

        await updateUserById(id, { is_verified: 0 })
        const confirmationToken = jwt.sign({ id: id, }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });

        await sendConfirmationEmail(newEmail, confirmationToken);
        userLog[0].email = newEmail;
    }

    let roleId = user.role_id

    if (user.role_name !== "admin" && user.role_name !== "moderator") {
        if (firstName.length <= 0 || lastName.length <= 0) {
            firstName = null;
            lastName = null;
            roleId = 1; // User
        }
        //  else {
        //     roleId = 3; // Author
        // }
    }

    if (req.user.role_id === 4) {
        if (parseInt(req.body.role) !== roleId) {
            roleId = parseInt(req.body.role);

            if (parseInt(req.body.role) === 3)
                sendInfoEmail({
                    email: user.email,
                    subject: 'Demande de publication d\'article',
                    html: `
                        <p>Bonjour,</p>
                        <p>Votre demande d'autorisation de publication d'articles a été validée par nos administrateurs.</p>
                        <p>Vous pouvez désormais publier des articles sur notre plateforme.</p>
                        <p>Veuillez consulter nos <a href="${process.env.FRONTEND_URL}/user-agreement">conditions d'utilisation</a>.</p>
                        
                    `
                });
        }
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
        userLog[0].password = hashedPassword;
    }

    // console.log(userLog[0])

    const updatedUser = {
        first_name: firstName,
        last_name: lastName,
        pseudo: pseudo || user.pseudo,
        email: userLog[0].email,
        // profil_picture: user.profil_picture,
        role_id: roleId,
        password: userLog[0].password, // mot de passe actuel ou mis à jour
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

    if (parseInt(id) === user.user_id) {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
    }

    await deleteUserById(id);

    return res.status(200).json({ message: "Utilisateur supprimé" });
}

export const getRoles = async (req, res) => {
    try {
        const roles = await findAllRoles()
        return res.status(200).json({ roles });
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: err });
    }

}