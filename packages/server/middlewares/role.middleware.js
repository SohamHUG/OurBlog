
export const isAdmin = async (req, res, next) => {
    if (req.user.role_name!== 'admin') {
        return res.status(403).send({ message: 'Vous n\'êtes pas autorisé' })
    }
    next()
}

export const isAuthor = async (req, res, next) => {
    if (req.user.role_name !== 'author' && req.user.role_name !== 'admin') {
        return res.status(403).send({ message: 'Vous n\'êtes pas autorisé' })
    }
    next();
}

export const isVerified = async (req, res, next) => {
    if (req.user.is_verified !== 1) {
        return res.status(401).send({ message: "Votre compte n'est pas vérifié" })
    }
    next();
}