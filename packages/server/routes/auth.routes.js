import {Router} from 'express';
import { createUser, loginUser, getUserData, refreshToken, logOutUser, confirmEmail } from '../controller/auth.controller.js';
import { validateSchema } from '../middlewares/validationSchemas.js';
import { userValidation } from '../validations/users.validation.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/register',[validateSchema(userValidation)], createUser);
router.post('/login', loginUser);
router.get('/me', [verifyToken], getUserData);
router.post('/refresh', [verifyToken], refreshToken);
router.post('/logout', logOutUser);

router.get('/confirm/:token', confirmEmail)

export default router;