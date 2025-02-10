import multer from 'multer';
import path from 'path';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

// Configuration de stockage de Multer pour enregistrer les fichiers sur le disque
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/'); // Dossier où les fichiers seront enregistrés
//     },
//     filename: function (req, file, cb) {
//         // Génère un nom de fichier unique basé sur la date actuelle
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
//     }
// });

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'files', // Dossier dans Cloudinary
        allowed_formats: ['jpg', 'jpeg', 'png'], // Formats acceptés
        public_id: (req, file) => {
            // générer un nom unique
            // console.log("Image envoyée à Cloudinary :", file);
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            return `${uniqueSuffix}`;
        },
    },
});

// Filtrer les types de fichiers acceptés
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png'];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Seuls les fichiers JPEG et PNG sont autorisés'));
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    // fileFilter: fileFilter
});

// console.log("Multer configuré pour accepter le champ: 'file'");

export default upload;