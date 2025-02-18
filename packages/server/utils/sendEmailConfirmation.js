import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER, // email d'envoi
        pass: process.env.EMAIL_PASSWORD, // clé d'application
    },
    // logger: true, 
    // debug: true,
});

// envoyer un email
export const sendConfirmationEmail = async (email, token) => {
    const confirmationUrl = `${process.env.FRONTEND_URL}/confirm/${token}`;
    await transporter.sendMail({
        from: '"OurBlog" <noreply@ourblog.com>',
        to: email,
        subject: "Confirmez votre adresse email",
        html: `
            <p>Bonjour,</p>
            <p>Merci de vous être inscrit sur OurBlog. Cliquez sur le lien ci-dessous pour confirmer votre adresse email :</p>
            <a href="${confirmationUrl}">Confirmer mon email</a>
            <p>Ce lien expire dans une heure.</p>
        `,
    });
}