import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { isVerified } from '../middlewares/role.middleware.js';
import { createComment, deleteComment, getComments } from '../controller/comment.controller.js';

const router = Router();

router.get('/', getComments);

router.use(authMiddleware)

router.post('/:id', [isVerified], createComment)
router.delete('/:id', deleteComment);

export default router;