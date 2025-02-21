import { Router } from 'express';
import { isAuthor, isVerified } from '../middlewares/role.middleware.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { createArticle, deleteArticle, getArticleById, getArticles, updateArticle } from '../controller/articles.controller.js';

const router = Router();

router.get('/', getArticles);
router.get('/:id', getArticleById);

router.use(authMiddleware, isAuthor, isVerified)

router.post('/create-article', createArticle);
router.put('/update/:id', updateArticle);
router.delete('/delete/:id', deleteArticle);

export default router;