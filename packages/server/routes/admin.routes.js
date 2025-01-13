import {Router} from 'express';
import { isAdmin, verifyToken } from '../middlewares/auth.middleware.js';
import { createCategory, deleteCategory } from '../controller/categories.controller.js';

const router = Router();

router.post('/create-category',[verifyToken, isAdmin], createCategory);
router.delete('/delete-category/:id', [verifyToken, isAdmin], deleteCategory)

export default router;