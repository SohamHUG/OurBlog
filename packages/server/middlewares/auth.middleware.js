import jwt from "jsonwebtoken";
import { getRoleById, getUserById } from "../models/user.model.js";
import dotenv from 'dotenv';
dotenv.config();

export const verifyToken = (req, res, next) => {

    const token = req.cookies.authToken;
    if (!token) {
        return res.status(401).send({ message: 'Token obligatoire' })
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
        if (err) {
            return res.status(401).send({ message: 'Token invalide' })
        }

        const user = await getUserById(payload.id)
        if (!user) {
            return res.status(401).send({ message: 'Token invalide' })
        }
        req.user = user
        next()
    })
}

export const isAdmin = async (req, res, next) => {
    // console.log(req.user)
    const role = await getRoleById(req.user.role_id)
    // console.log(role)
    if (role.name !== 'admin') {
        return res.status(401).send({ message: 'Vous n\'êtes pas autorisé' })
    }
    next()
}

export const isAuthor = async (req, res, next) => {

    const role = await getRoleById(req.user.role_id)
    // console.log(role)
    if (role.name !== 'author' && role.name !== 'admin') {
        return res.status(401).send({ message: 'Vous n\'êtes pas autorisé' })
    }
    next()
}