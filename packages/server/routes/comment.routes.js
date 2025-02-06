import {Router} from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { isVerified } from '../middlewares/role.middleware.js';
import { createComment, getComments } from '../controller/comment.controller.js';

const router = Router();

router.post('/:id', [authMiddleware, isVerified], createComment)

router.get('/', getComments)

export default router;