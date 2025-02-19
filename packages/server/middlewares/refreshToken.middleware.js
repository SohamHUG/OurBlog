import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import { findUserById, updateUserById } from "../models/user.model.js";

dotenv.config();

export const refreshTokenMiddleware = async (req, res, next) => {
    const { accessToken, refreshToken } = req.cookies;

    if (!accessToken && !refreshToken) {
        // Supprimer les cookies existants
        // res.clearCookie('accessToken');
        // res.clearCookie('refreshToken');
        return next(); // Passer au middleware suivant sans vérifier l'authentification
    }

    try {
        const verifAccess = jwt.verify(accessToken, process.env.JWT_SECRET);
        if (verifAccess) {
            return next();
        }

    } catch (error) {
        // console.log('AccessToken expiré ou invalide, vérification du RefreshToken...');

        if (!refreshToken) {
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');
            return res.status(401).json({ message: 'Non autorisé, veuillez vous reconnecter' });
        }

        try {
            const verifyRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)

            // console.log(verifyRefreshToken);
            // if (!verifyRefreshToken) { // Si le Refresh Token n'est pas valide
            //     res.clearCookie('accessToken');
            //     res.clearCookie('refreshToken');
            //     return res.status(401).send({ message: 'Token invalide' })
            // }

            const user = await findUserById(verifyRefreshToken.id)
            // console.log(user)
            if (!user || user.refresh_token !== refreshToken) {
                res.clearCookie('accessToken');
                res.clearCookie('refreshToken');
                return res.status(401).json({ message: 'RefreshToken invalide ou utilisateur inexistant' });
            }

            // if (user.refresh_token !== refreshToken) {
            //     res.clearCookie('accessToken');
            //     res.clearCookie('refreshToken');
            //     console.log('ici2')
            //     return res.status(401).json({ message: 'RefreshToken invalide ou utilisateur inexistant' });
            // }


            // Générer un nouveau token d'accès et un nouveau Refresh Token
            const newAccessToken = jwt.sign({ id: user.user_id, }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });

            // const newRefreshToken = jwt.sign({ id: user.user_id, }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION });

            // await updateUserById(user.user_id, { refresh_token: newRefreshToken });

            res.cookie('accessToken', newAccessToken, {
                httpOnly: true,
                secure: true, 
                sameSite: 'strict', // Limite les cookies aux mêmes origines
                maxAge: 3600000, // 1 heure
                // maxAge: 30 * 1000, // 10 sec
            });

            // res.cookie('refreshToken', newRefreshToken, {
            //     httpOnly: true,
            //     secure: true, 
            //     sameSite: 'strict', // Limite les cookies aux mêmes origines
            //     maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
            //     // maxAge: 10 * 1000, // 10 sec

            // });

            next();
        } catch (refreshError) {
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');
            console.error('Erreur avec le RefreshToken :', refreshError);
            return res.status(401).json({ message: 'Authentification échouée, veuillez vous reconnecter' });
        }

    }


}
