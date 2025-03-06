
export const isAdmin = async (req, res, next) => {
    if (req.user.role_id !== 4) {
        return res.status(403).send({ message: 'Vous n\'êtes pas autorisé' })
    }
    next()
}

export const isAuthor = async (req, res, next) => {
    if (req.user.role_id !== 3 && req.user.role_id !== 4) {
        return res.status(403).send({ message: 'Vous n\'êtes pas autorisé' })
    }
    next();
}

export const isVerified = async (req, res, next) => {
    if (req.user.is_verified !== 1) {
        return res.status(403).send({ message: "Votre compte n'est pas vérifié" })
    }
    next();
}