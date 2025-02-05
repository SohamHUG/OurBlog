import {Router} from 'express';
import { isAuthor, isVerified } from '../middlewares/role.middleware.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { createArticle, deleteArticle, getArticleById, getArticles, updateArticle } from '../controller/articles.controller.js';

const router = Router();

router.get('/', getArticles);

router.get('/:id', getArticleById);

router.post('/create-article', [authMiddleware, isAuthor, isVerified], createArticle);

router.put('/update/:id', [authMiddleware, isAuthor, isVerified], updateArticle);

router.delete('/delete/:id', [authMiddleware, isAuthor, isVerified], deleteArticle);

export default router;