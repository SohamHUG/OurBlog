import { Router } from 'express';
import { deleteProfilPicture, uploadArticleFiles, uploadProfilPic } from '../controller/uploads.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/upload.middleware.js';
import { isVerified } from '../middlewares/role.middleware.js';

const router = Router();

router.post('/profil-picture', [authMiddleware, isVerified, upload.single('profilPicture')], uploadProfilPic);

router.post('/article-files', [authMiddleware, isVerified, upload.single('file')], uploadArticleFiles);

router.delete('/profil-picture/:id', [authMiddleware, isVerified], deleteProfilPicture)

export default router;