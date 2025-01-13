export const validateSchema = (schema) => async (req, res, next) => {
    try {
        await schema.validate(req.body, { abortEarly: false });
        next();
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ errors: err.errors });
        }

        return res.status(500).json({ message: "Erreur de validation inconnue" });
    }
};