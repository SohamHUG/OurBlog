import { findUserById, findByCredentials, saveUser, updateUserById } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import { sendConfirmationEmail } from "../utils/index.js";
import dotenv from 'dotenv';

dotenv.config();

export const register = async (req, res) => {
    try {
        let { firstName, lastName, pseudo, email, password } = req.body;
        let roleId = 1; //User

        const emailAlreadyExist = await findByCredentials(email);

        if (emailAlreadyExist && emailAlreadyExist.length > 0) {
            return res.status(400).json({ message: "Cet email est déja utilisé", });
        }

        // if (firstName.length <= 0 || lastName.length <= 0) {
        //     firstName = null;
        //     lastName = null;
        // } else {
        //     roleId = 3; //Author
        // }

        const hash = bcrypt.hashSync(password, 10);

        const newUser = await saveUser({
            firstName,
            lastName,
            pseudo,
            email,
            roleId,
            hash
        });

        const confirmationToken = jwt.sign({ id: newUser.user_id, }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });

        await sendConfirmationEmail(email, confirmationToken);

        return res.status(201).json({ message: "User created", newUser });
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: err });
    }
}

export const sendEmail = async (req, res) => {

    try {
        const user = req.user

        const confirmationToken = jwt.sign({ id: user.user_id, }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });

        await sendConfirmationEmail(user.email, confirmationToken);

        return res.status(200).json({ message: "Mail envoyé" });
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: err });
    }

}

export const confirmEmail = async (req, res) => {
    const { token } = req.params;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        // console.log(decoded)

        await updateUserById(userId, { is_verified: 1 });
        res.status(200).json({ message: 'Votre email a été confirmé avec succès !' });

    } catch (err) {
        console.error(err)
        res.status(400).json({ message: err });
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await findByCredentials(email);

        if (!user || user.length <= 0) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect", });
        }
        // console.log(user);

        const verifyPassword = bcrypt.compareSync(password, user[0].password);

        if (!verifyPassword) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect", });

        }
        const accessToken = jwt.sign({ id: user[0].id, }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });

        const refreshToken = jwt.sign({ id: user[0].id, }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION });

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: true, 
            sameSite: 'strict', // Limite les cookies aux mêmes origines
            maxAge: 3600000, // 1 heure
            // maxAge: 30 * 1000, // 10 sec
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true, 
            sameSite: 'strict', // Limite les cookies aux mêmes origines
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
            // maxAge: 30 * 1000, // 10 sec
        });

        await updateUserById(user[0].id, { refresh_token: refreshToken });

        return res.status(200).json({ message: "Connexion réussi !" });

    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: err });
    }
}

export const logOutUser = async (req, res) => {
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken');
    // await updateUserById(req.user.user_id, { refresh_token: null });
    res.status(200).json({ message: 'Logout successfull' });
}