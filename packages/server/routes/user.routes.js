import {Router} from 'express';
import { getUserById, updateUser } from '../controller/user.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/upload.middleware.js';

const router = Router();

router.get('/me', [authMiddleware], getUserById);

router.put('/update/:id', [authMiddleware], updateUser)

router.post('/profi-picture', [authMiddleware, upload.single('profil_picture')], )

export default router;