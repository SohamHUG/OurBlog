import { Router } from "express";

import categoriesRoutes from './categories.routes.js';
import authRoutes from './auth.routes.js';
import adminRoutes from './admin.routes.js';
import articleRoutes from './articles.routes.js';


const router= Router();

router.use('/categories', categoriesRoutes);

router.use('/auth', authRoutes);

router.use('/admin', adminRoutes);

router.use('/article', articleRoutes);

export default router;