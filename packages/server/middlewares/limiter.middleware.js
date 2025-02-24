import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 4, // Limite chaque IP à 4 requêtes dans la fenêtre de 15 minutes
    message: { message: "Trop de tentatives, veuillez réessayer plus tard." },
    headers: true, // Ajoute les headers informant du statut des limites
    standardHeaders: true, // Active les headers standards (RateLimit-Limit, RateLimit-Remaining, RateLimit-Reset)
    legacyHeaders: false, // Désactive les headers obsolètes (X-RateLimit-*)
});

export const limiter = (req, res, next) => {
    if (req.user && req.user.role_id === 4) {
        return next();
    }
    return authLimiter(req, res, next);
}

export const speedLimiter = slowDown({
    windowMs: 15 * 60 * 1000, // 15 minutes
    delayAfter: 50, // Après 50 requêtes dans la fenêtre
    delayMs: (hits) => hits * 500, // Ajoute 500ms par requête après la 10ème
});

export const speedLimiterOnSensitive = (req, res, next) => {
    const sensitiveMethods = ['POST', 'PATCH', 'PUT', 'DELETE'];

    if (sensitiveMethods.includes(req.method)) {
        return speedLimiter(req, res, next);
    }
    next();
};
