
export const isAdmin = async (req, res, next) => {
    // console.log(req.user)
    // const role = await getRoleById(req.user.role_id)
    // console.log(role)
    if (req.user.role_name!== 'admin') {
        return res.status(401).send({ message: 'Vous n\'êtes pas autorisé' })
    }
    next()
}

export const isAuthor = async (req, res, next) => {

    // const role = await getRoleById(req.user.role_id)
    // console.log(role)
    if (req.user.role_name !== 'author' && req.user.role_name !== 'admin') {
        return res.status(401).send({ message: 'Vous n\'êtes pas autorisé' })
    }
    next()
}