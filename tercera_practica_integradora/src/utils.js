import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from "bcrypt";
import nodemailer from 'nodemailer';
import config from "./config.js";
import { customAlphabet } from 'nanoid';

const { ADMINUSER, ADMINPASS } = config;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default __dirname;

export const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

export const validatePassword = (password, user) => {
    return bcrypt.compareSync(password, user.password);
};

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587, 
    secure: false, 
    auth: {
        user: ADMINUSER, 
        pass: ADMINPASS 
    }
});


const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(alphabet, 32); 

export function generateResetToken() {
    return nanoid();
}

export async function sendPasswordResetEmail(email, resetLink) {
    const mailOptions = {
        from: 'your@mundocan.com',
        to: email,
        subject: 'Restablecimiento de contraseña',
        html: `Para restablecer tu contraseña, haz clic en el siguiente enlace: <a href="${resetLink}">${resetLink}</a>`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Correo electrónico de restablecimiento enviado a ${email}`);
    } catch (error) {
        console.error(`Error al enviar el correo electrónico de restablecimiento a ${email}: ${error}`);
    }
}

export function isResetLinkExpired(requestedAt) {
    const expirationTime = new Date(requestedAt);
    expirationTime.setHours(expirationTime.getHours() + 1); 
    const currentTime = new Date();
    return currentTime > expirationTime;
}