import { getRoleById, getUserById, getUserLogin, saveUser, verifyUser } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendConfirmationEmail } from "../utils/index.js";

export const createUser = async (req, res) => {
    try {

        const { firstName, lastName, pseudo, email, password } = req.body;
        const data = await saveUser(firstName, lastName, pseudo, email, password);

        const confirmationToken = jwt.sign({ id: data.id, }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });

        await sendConfirmationEmail(email, confirmationToken);

        return res.status(201).json({ message: "User created", data, confirmationToken });
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

        await verifyUser(userId);
        res.status(200).json({ message: 'Votre email a été confirmé avec succès !' });

    } catch (err) {
        console.error(err)
        res.status(400).json({ message: err });
    }
}

export const loginUser = async (req, res) => {
    try {

        // console.log(req.session)
        const { email, password } = req.body;
        const data = await getUserLogin(email, password);

        const token = jwt.sign({ id: data.id, }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });

        res.cookie('authToken', token, {
            httpOnly: true,
            secure: false, // à modifier à true car pas https pour l'instant
            sameSite: 'strict', // Limite les cookies aux mêmes origines
            maxAge: 3600000, // 1 heure
        });

        return res.status(201).json({ message: "User connected", data });

    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: err });
    }
}

export const getUserData = async (req, res) => {
    try {

        const user = req.user;

        // const user = await getUserById(userId);
        const role = await getRoleById(user.role_id);

        if (role) user.role_id = role.name;

        return res.status(201).json({ user });
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: err });
    }
}

export const refreshToken = async (req, res) => {
    try {
        const user = req.user

        const token = jwt.sign({ id: user.id, }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('authToken', token, {
            httpOnly: true,
            secure: false, // à modifier à true car pas https pour l'instant
            sameSite: 'strict', // Limite les cookies aux mêmes origines
            maxAge: 3600000, // 1 heure
        });

        return res.status(201).json({ message: 'Token refresh' });
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: err });
    }
}

export const logOutUser = async (req, res) => {
    res.clearCookie('authToken', {
        httpOnly: true,
        secure: false, // à modifier à true car pas https pour l'instant
        sameSite: 'strict',
    })

    res.status(200).json({ message: 'Logout successfull' });
}