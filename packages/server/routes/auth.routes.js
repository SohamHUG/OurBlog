import {Router} from 'express';
import { register, loginUser, getUserById, logOutUser, confirmEmail } from '../controller/auth.controller.js';
import { validateSchema } from '../middlewares/validationSchemas.js';
import { userValidation } from '../validations/users.validation.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/register',[validateSchema(userValidation)], register);
router.post('/login', loginUser);
router.get('/me', [authMiddleware], getUserById);
router.get('/logout', [authMiddleware], logOutUser);

router.get('/confirm/:token', confirmEmail)

export default router;