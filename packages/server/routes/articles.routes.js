import {Router} from 'express';
import { isAuthor } from '../middlewares/role.middleware.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { createArticle } from '../controller/articles.controller.js';

const router = Router();

router.post('/create-article', [authMiddleware, isAuthor], createArticle);

export default router;