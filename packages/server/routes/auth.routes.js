import { Router } from 'express';
import { register, loginUser, logOutUser, confirmEmail, sendEmail } from '../controller/auth.controller.js';
import { validateSchema } from '../middlewares/validationSchemas.js';
import { userValidation } from '../validations/users.validation.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { authLimiter } from '../middlewares/limiter.middleware.js';

const router = Router();

router.post('/register', [validateSchema(userValidation), authLimiter], register);
router.post('/login',[authLimiter], loginUser);
router.get('/logout', logOutUser);
router.get('/confirm/:token', confirmEmail)
router.get('/confirm-email',[authMiddleware, authLimiter], sendEmail)

export default router;