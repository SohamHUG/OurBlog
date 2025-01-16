import jwt from "jsonwebtoken";
import { findUserById } from "../models/user.model.js";
import dotenv from 'dotenv';
dotenv.config();

export const authMiddleware = (req, res, next) => {

    const { accessToken } = req.cookies;
    if (!accessToken) {
        return res.status(401).send({ message: 'Token obligatoire' })
    }

    jwt.verify(accessToken, process.env.JWT_SECRET, async (err, payload) => {
        if (err) {
            return res.status(401).send({ message: 'Token invalide' })
        }
        // console.log(payload)
        const user = await findUserById(payload.id)
        if (!user) {
            return res.status(401).send({ message: 'Token invalide' })
        }
        // if (user.is_verified !== 1) {
        //     return res.status(401).send({ message: "Votre compte n'est pas vérifié" })
        // }
        req.user = user
        next();
    })
}