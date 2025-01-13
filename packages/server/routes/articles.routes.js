import {Router} from 'express';
import { isAuthor, verifyToken } from '../middlewares/auth.middleware.js';
import { createArticle } from '../controller/articles.controller.js';

const router = Router();

router.post('/create-article', [verifyToken, isAuthor], createArticle);

export default router;