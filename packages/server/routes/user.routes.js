import { Router } from 'express';
import { deleteUser, getUserById, updateUser} from '../controller/user.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/upload.middleware.js';

const router = Router();

router.get('/me', [authMiddleware], getUserById);

router.put('/update/:id', [authMiddleware], updateUser);

router.delete('/:id', [authMiddleware], deleteUser)


export default router;