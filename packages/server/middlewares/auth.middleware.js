import jwt from "jsonwebtoken";
import { findUserById } from "../models/user.model.js";
import dotenv from 'dotenv';
dotenv.config();

export const authMiddleware = (req, res, next) => {
    const { accessToken } = req.cookies;
    if (!accessToken) {
        return res.status(401).json({ message: 'Token obligatoire' });
    }

    jwt.verify(accessToken, process.env.JWT_SECRET, async (err, payload) => {
        if (err) {
            return res.status(401).json({ message: 'Token invalide' });
        }

        try {
            const user = await findUserById(payload.id);
            if (!user) {
                return res.status(401).json({ message: 'Token invalide' });
            }

            req.user = user;
            next();
        } catch (error) {
            console.error("Erreur lors de la récupération de l'utilisateur :", error);
            return res.status(500).json({ message: "Erreur serveur, veuillez réessayer plus tard" });
        }
    });
};