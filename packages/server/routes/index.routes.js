import { Router } from "express";

import categoriesRoutes from './categories.routes.js';
import authRoutes from './auth.routes.js';
import adminRoutes from './admin.routes.js';
import articleRoutes from './articles.routes.js';
import userRoutes from './user.routes.js';
import tagRoutes from './tags.routes.js';
import commentRoutes from './comment.routes.js'
import uploadRoutes from './upload.routes.js'
import { search } from "../controller/search.controller.js";

const router= Router();

router.use('/categories', categoriesRoutes);

router.use('/tags', tagRoutes);

router.use('/auth', authRoutes);

router.use('/admin', adminRoutes);

router.use('/articles', articleRoutes);

router.use('/comments', commentRoutes);

router.use('/users', userRoutes);

router.use('/upload', uploadRoutes);

router.get('/search', search)

export default router;