export const validateSchema = (schema) => async (req, res, next) => {
    try {
        await schema.validate(req.body, { abortEarly: false });
        next();
    } catch (err) {
        // console.log(err.errors)
        if (err.name === 'ValidationError') {
            // console.log(err.errors)
            return res.status(400).json({ message: err.errors });
        }

        return res.status(500).json({ message: "Erreur de validation inconnue" });
    }
};