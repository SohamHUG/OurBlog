import { Router } from 'express';
import { deleteProfilPicture, uploadArticleFiles, uploadProfilPic } from '../controller/uploads.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/upload.middleware.js';
import { isVerified, isAuthor } from '../middlewares/role.middleware.js';

const router = Router();

router.use(authMiddleware, isVerified)

router.post('/profil-picture', [upload.single('profilPicture')], uploadProfilPic);

// router.post('/profil-picture', authMiddleware, isVerified, (req, res, next) => {
//     console.log("Headers:", req.headers);
//     console.log("Body:", req.body);
//     console.log("Files:", req.files);
//     console.log("File:", req.file);
//     next();
// }, upload.single('profilPicture'), uploadProfilPic);

router.post('/article-files', [isAuthor, upload.single('articleFile')], uploadArticleFiles);

// router.post('/article-files', authMiddleware, isVerified, (req, res, next) => {
//     console.log("Headers:", req.headers);
//     console.log("Body:", req.body);
//     console.log("Files:", req.files);
//     console.log("File:", req.file);
//     next();
// }, upload.single('articleFile'), uploadArticleFiles);


router.delete('/profil-picture/:id', deleteProfilPicture)

export default router;