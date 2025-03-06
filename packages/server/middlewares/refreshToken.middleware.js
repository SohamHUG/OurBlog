import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import { findUserById, updateUserById } from "../models/user.model.js";

dotenv.config();

export const refreshTokenMiddleware = async (req, res, next) => {
    const { accessToken, refreshToken } = req.cookies;

    if (!accessToken && !refreshToken) {
        return next(); // Passer au middleware suivant sans vérifier l'authentification
    }

    try {
        const verifAccess = jwt.verify(accessToken, process.env.JWT_SECRET);
        if (verifAccess) {
            return next();
        }

    } catch (error) {
        // console.log('AccessToken expiré ou invalide, vérification du RefreshToken...');

        // console.log('la')

        if (!refreshToken) {
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
            return res.status(401).json({ message: 'Non autorisé, veuillez vous reconnecter' });
        }

        // console.log('')

        try {
            const verifyRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)

            const user = await findUserById(verifyRefreshToken.id)
            // console.log(user)
            if (!user || user.refresh_token !== refreshToken) {
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
                return res.status(401).json({ message: 'RefreshToken invalide ou utilisateur inexistant' });
            }

            // Générer un nouveau token d'accès
            const newAccessToken = jwt.sign({ id: user.user_id, }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });

            res.cookie('accessToken', newAccessToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'None', // Limite les cookies aux mêmes origines
                maxAge: 3600000, // 1 heure
                // maxAge: 60 * 1000, // 60 sec
            });

            req.cookies.accessToken = newAccessToken;

            next();
        } catch (refreshError) {
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
            console.error('Erreur avec le RefreshToken :', refreshError);
            return res.status(401).json({ message: 'Authentification échouée, veuillez vous reconnecter' });
        }

    }


}
