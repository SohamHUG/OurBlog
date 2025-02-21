import {Router} from 'express';
import { createCategory, getCategories, getCategory } from '../controller/categories.controller.js';

const router = Router();

router.get('/', getCategories);
router.get('/:id', getCategory);

export default router;