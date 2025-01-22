import { Router } from 'express';
import { deleteProfilPicture, uploadArticleFiles, uploadProfilPic } from '../controller/uploads.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/upload.middleware.js';

const router = Router();

router.post('/profil-picture', [authMiddleware, upload.single('profilPicture')], uploadProfilPic);

router.post('/article-files', [authMiddleware, upload.single('file')], uploadArticleFiles);

router.delete('/profil-picture/:id', [authMiddleware], deleteProfilPicture)

export default router;