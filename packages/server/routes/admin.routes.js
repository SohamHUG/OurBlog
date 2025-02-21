import { Router } from 'express';
import { isAdmin } from '../middlewares/role.middleware.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { createCategory, deleteCategory } from '../controller/categories.controller.js';
import { getRoles, getUsers } from '../controller/user.controller.js';

const router = Router();

router.use(authMiddleware, isAdmin)

router.post('/create-category', createCategory);
router.delete('/delete-category/:id', deleteCategory);
router.get('/users', getUsers)
router.get('/roles', getRoles)

export default router;