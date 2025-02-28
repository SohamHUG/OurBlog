import { Router } from 'express';
import { register, loginUser, logOutUser, confirmEmail, sendEmail, contact } from '../controller/auth.controller.js';
import { validateSchema } from '../middlewares/validationSchemas.js';
import { userValidation } from '../validations/users.validation.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { authLimiter } from '../middlewares/limiter.middleware.js';

const router = Router();

router.post('/register', [validateSchema(userValidation),], register);
router.post('/login', [], loginUser);
router.get('/logout', logOutUser);
router.get('/confirm/:token', confirmEmail)
router.post('/confirm-email', [authMiddleware,], sendEmail)
router.post('/contact', [], contact)

export default router;