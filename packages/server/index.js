import express from 'express';
import db from './config/db.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './routes/index.routes.js';
import dotenv from 'dotenv';
import { refreshTokenMiddleware } from './middlewares/refreshToken.middleware.js';
import uploadRoutes from './routes/upload.routes.js';

dotenv.config();

const port = process.env.PORT;

const app = express();

app.use(cors({
    // origin: process.env.FRONTEND_URL.trim(), // Origine autorisée (frontend)
    origin: 'http://localhost:5173', // Origine autorisée (frontend)
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'], // Méthodes autorisées
    allowedHeaders: ['Content-Type'], // En-têtes autorisés
    credentials: true // Autoriser l'envoi de cookie (JWT par exemple)
}));

app.use(cookieParser());

app.use(refreshTokenMiddleware);
app.use('/upload', uploadRoutes)

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // lire le body lorsque le payload sera de type form-data-urlencoded (formulaire)

app.use('/uploads', express.static('uploads'));

app.use(routes);

app.listen(port, () => {

    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting: ' + err.stack);
            return;
        }
        console.log(`La connexion à la base de données est établie avec l'ID ${connection.threadId}`);
    });
    console.log(`Server started on http://localhost:${port}`);
});