import { deleteUserById, findAllUsers, findByCredentials, findPopularUsers, findUserById, updateUserById } from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import { sendConfirmationEmail, sendInfoEmail } from "../utils/index.js";
import { findAllRoles } from "../models/roles.model.js";
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();


export const getMine = async (req, res) => {
    try {
        const user = req.user;

        const { refresh_token, role_id, ...userData } = user; // filtre les infos "sensibles"

        return res.status(201).json({ user: userData });
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: err });
    }
}

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const { accessToken } = req.cookies;
        let requestingUser;

        if (accessToken) {
            try {
                const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
                requestingUser = await findUserById(decoded.id);
            } catch (err) {
                console.log('Token invalide');
            }
        }

        const user = await findUserById(id)
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        if (requestingUser && requestingUser.role_id === 4) { // envoie toutes les infos de l'user si un admin requete
            return res.status(201).json({ user });
        } else {
            const { refresh_token, email, role_id, role_name, is_verified, ...userData } = user; // Sinon on filtre

            return res.status(201).json({ user: userData });
        }


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
    try {
        const { id } = req.params;
        const userId = req.user.user_id;
        let { firstName, lastName, pseudo, email, newEmail, oldPassword, newPassword, role } = req.body;

        if (parseInt(id) !== userId && req.user.role_id !== 4) {
            return res.status(403).json({ message: "Vous n'êtes pas autorisé." });
        }

        if (pseudo.length < 2) {
            return res.status(400).json({ message: "Le pseudo doit contenir deux caractères minimum", });
        }

        const userLog = await findByCredentials(email);
        if (!userLog || userLog.length <= 0) {
            return res.status(404).json({ message: "Utilisateur introuvable." });
        }

        if (newEmail && newEmail !== email) {
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

        // infos de l'utilisateur
        const user = await findUserById(id);
        let roleId = user.role_id;

        if (user.role_id !== 4 && user.role_id !== 2) { // ? admin et moderateur peuvent être anonyme ?
            if (!firstName || !lastName) {
                firstName = null;
                lastName = null;
                roleId = 1; // User
            }
            //  else {
            //     roleId = 3; // Author
            // }
        }

        // seul un admin peut modifier un rôle
        if (req.user.role_id === 4) {
            if (req.body.role && parseInt(req.body.role) !== roleId) { // si le role est différent on met à jour
                roleId = parseInt(req.body.role);

                if (parseInt(req.body.role) === 3) { // si il devient auteur on envoie un email
                    await sendInfoEmail({
                        email: user.email,
                        subject: " Validation de votre demande de publication d'articles",
                        html: `
                            <p>Bonjour,</p>
                            <p>Nous avons le plaisir de vous informer que votre demande d'autorisation de publication d'articles a été validée par notre équipe.</p>
                            <p>Vous pouvez désormais publier des articles sur notre plateforme.</p>
                            <p>⚠️ <strong>Important</strong> : Si vous retirez votre nom ou prénom de votre profil, votre rôle d’auteur sera automatiquement supprimé.</p>
                            <p>Nous vous invitons à re-consulter nos <a href="${process.env.FRONTEND_URL}/user-agreement">conditions d'utilisation</a>.</p>
                            <p>Cordialement,<p>
                            <a href="${process.env.FRONTEND_URL}" style="text-decoration: none; color:#000; font-size: 33px; font-family: pridi; font-weight: 300;">OurBlog</a>
                    `
                    });
                }
            }
        }

        // Mise à jour du mot de passe
        if (oldPassword && newPassword) {
            if (oldPassword.length < 6 || newPassword.length < 6) {
                return res.status(400).json({ message: "Les mots de passe doivent contenir au moins 6 caractères." });
            }

            const passwordMatch = await bcrypt.compare(oldPassword, userLog[0].password);
            if (!passwordMatch) {
                return res.status(401).json({ message: "L'ancien mot de passe est incorrect." });
            }

            userLog[0].password = await bcrypt.hash(newPassword, 10);
        }

        // Mise à jour de l'utilisateur
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
        const newUser = await findUserById(userId);

        return res.status(200).json({ message: "Informations mises à jour avec succès.", user: newUser });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erreur interne du serveur." });
    }
};

export const deleteUser = async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    try {

        const userToDelete = await findUserById(id);

        if (!userToDelete) {
            return res.status(404).json({ message: "Utilisateur introuvable." });
        }

        if (parseInt(id) !== user.user_id && req.user.role_id !== 4) {
            return res.status(403).json({ message: "Vous n'êtes pas autorisé" });
        }

        if (parseInt(id) === user.user_id) {
            res.clearCookie('accessToken', {
                httpOnly: true,
                secure: true,
                sameSite: 'None'
            });

            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: true,
                sameSite: 'None'
            });
        }
        
        if (userToDelete.profil_picture_public_id) {
            await cloudinary.uploader.destroy(userToDelete.profil_picture_public_id);
        }

        await deleteUserById(id);

        return res.status(200).json({ message: "Utilisateur supprimé" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erreur interne du serveur." });
    }
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