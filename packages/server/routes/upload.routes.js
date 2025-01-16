import { Router } from 'express';
import { uploadProfilPic } from '../controller/uploads.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/upload.middleware.js';

const router = Router();

router.post('/profil-picture', [authMiddleware, upload.single('profilPicture')], uploadProfilPic);

export default router;