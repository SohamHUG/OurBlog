import { Router } from 'express';
import { isAdmin } from '../middlewares/role.middleware.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { createCategory, deleteCategory } from '../controller/categories.controller.js';
import { getRoles, getUsers } from '../controller/user.controller.js';

const router = Router();

router.post('/create-category', [authMiddleware, isAdmin], createCategory);

router.delete('/delete-category/:id', [authMiddleware, isAdmin], deleteCategory);

router.get('/users', [authMiddleware, isAdmin], getUsers)

router.get('/roles', [authMiddleware, isAdmin], getRoles)

export default router;