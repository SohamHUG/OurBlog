import {Router} from 'express';
import { createCategory, getCategories, getCategory } from '../controller/categories.controller.js';
import { isAdmin, verifyToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', getCategories);
router.get('/:id', getCategory);
// router.post('/create', [verifyToken, isAdmin], createCategory);

export default router;