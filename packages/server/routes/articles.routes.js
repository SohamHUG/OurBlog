import { Router } from 'express';
import { isAuthor, isVerified } from '../middlewares/role.middleware.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { createArticle, deleteArticle, getArticleById, getArticles, updateArticle } from '../controller/articles.controller.js';
import { validateSchema } from '../middlewares/validationSchemas.js';
import { articleValidation } from '../validations/articles.validation.js';

const router = Router();

router.get('/', getArticles);
router.get('/:id', getArticleById);

router.use(authMiddleware, isAuthor, isVerified)

router.post('/create-article', [validateSchema(articleValidation)], createArticle);
router.put('/update/:id',[validateSchema(articleValidation)], updateArticle);
router.delete('/delete/:id', deleteArticle);

export default router;