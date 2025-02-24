import { Router } from 'express';
import { deleteProfilPicture, uploadArticleFiles, uploadProfilPic } from '../controller/uploads.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/upload.middleware.js';
import { isVerified, isAuthor } from '../middlewares/role.middleware.js';
import { limiter } from '../middlewares/limiter.middleware.js';

const router = Router();

router.use(authMiddleware, isVerified)

router.post('/profil-picture', [limiter, upload.single('profilPicture')], uploadProfilPic);

router.post('/article-files', [isAuthor, upload.single('articleFile')], uploadArticleFiles);

router.delete('/profil-picture/:id', deleteProfilPicture)

export default router;