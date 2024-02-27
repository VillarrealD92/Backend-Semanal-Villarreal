import Mail from '../modules/mail.module.js';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import { userModel } from '../DAO/mongoDB/models/user.model.js';
import { generateToken, isValidPassword, createHash } from '../utils.js';
import { logger } from '../utlis/loggerDev.js';

const mailModule = new Mail();

export const register = async (req, res) => {
    try {
        res.redirect('/api/session/login');
    } catch (error) {
        logger.error("Failed to redirect to login page: " + error.message);
        res.status(500).send("Error in register: " + error.message);
    }
}

export const login = async (req, res) => {
    try {
        res.cookie('cookieUS', req.user.token).redirect('/');
    } catch (error) {
        logger.error("Failed to login user: " + error.message);
        res.status(500).send("Error in login: " + error.message);
    }
}

export const logout = (req, res) => {
    try {
        req.session.destroy(err => {
            if (err) {
                logger.error("Logout error: " + err.message);
                return res.status(500).send("Logout error");
            }
            return res.redirect("/");
        });
    } catch (error) {
        logger.error("Failed to logout: " + error.message);
        res.status(500).send("Failed to logout");
    }
}

export const current = async (req, res) => {
    try {
        req.session.destroy(error => {
            if (error) {
                logger.error("Error closing session: " + error.message);
                return res.send('Error al cerrar sesión');
            }
            res.clearCookie('cookieUS');
            return res.redirect('/api/session/login');
        });
    } catch (error) {
        logger.error("Error in current session: " + error.message);
        res.status(500).send("Error in current session");
    }
}

export const githubCallback = (req, res) => {
    try {
        res.cookie('cookieUS', req.user.token).redirect('/');
    } catch (error) {
        logger.error("Failed to login with GitHub: " + error.message);
        res.status(500).send("Failed to login with GitHub");
    }
}

export const getUserId = async (req, res) => {
    try {
        const { user } = req.user;
        res.send({ result: user._id });
    } catch (error) {
        logger.error("Failed to get user ID: " + error.message);
        res.status(500).send("Failed to get user ID");
    }
}

export const sendEmail = async (req, res) => {
    try {
        const { email } = req?.params;
        const token = generateToken(email);
        const html = `<button><a href="http://localhost:${config.PORT}/api/session/recoverPassword/${token}">Recuperar contraseña</a></button>`;
        await mailModule.send(email, "Restablecer contraseña", html);
        res.send("Email sent successfully");
    } catch (error) {
        logger.error("Error sending email: " + error.message);
        res.status(500).send("Error sending email");
    }
}

export const recoverPassword = async (req, res) => {
    try {
        const { token } = req?.params;
        if (!token) return res.status(400).send({ error: "Token is incorrect" });
        let catchError = false;
        const result = jwt.verify(token, config.KEY, (error, credentials) => {
            if (error?.message.includes('expired')) catchError = true;
            return credentials;
        });
        if (catchError === false) res.cookie('active', token, { maxAge: 3600000 });
        res.render(catchError === false ? 'recoverPassword' : 'foundEmail', { style: 'index.css' });
    } catch (error) {
        logger.error("Error in recover password: " + error.message);
        res.status(500).send("Error in recover password");
    }
}

export const changePassword = async (req, res) => {
    try {
        const { pass } = req?.params;
        const hashPassword = createHash(pass);
        const userReminder = req?.cookies?.active;
        const result = jwt.verify(userReminder, config.KEY, (error, credentials) => credentials);
        const userNeeded = await userModel.findOne({ email: result.user });
        const comparative = isValidPassword(userNeeded, pass);
        userNeeded.password = hashPassword;
        if (comparative === true) return res.send(comparative);
        if (comparative === false) {
            await userModel.updateOne({ _id: userNeeded._id }, userNeeded);
            res.clearCookie('active');
            return res.send(false);
        }
    } catch (error) {
        logger.error("Error in change password: " + error.message);
        res.status(500).send("Error in change password");
    }
}