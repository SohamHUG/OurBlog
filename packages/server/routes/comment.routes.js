import {Router} from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { isVerified } from '../middlewares/role.middleware.js';
import { createComment, deleteComment, getComments } from '../controller/comment.controller.js';

const router = Router();

router.post('/:id', [authMiddleware, isVerified], createComment)

router.get('/', getComments);

router.delete('/:id', [authMiddleware], deleteComment);

export default router;