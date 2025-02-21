import { Router } from 'express';
import { deleteUser, getMine, getPopularUsers, getUserById, updateUser } from '../controller/user.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { isVerified } from '../middlewares/role.middleware.js';

const router = Router();

// router.get('/', getMine);

router.get('/me', [authMiddleware], getMine);
router.get('/popular', getPopularUsers);
router.get('/:id', getUserById);
router.put('/update/:id', [authMiddleware, isVerified], updateUser);
router.delete('/:id', [authMiddleware], deleteUser)


export default router;