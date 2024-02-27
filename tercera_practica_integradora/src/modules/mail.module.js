import nodemailer from 'nodemailer';
import config from '../config/config.js';
import { logger } from '../utlis/loggerDev.js'; 

export default class Mail {
    constructor() {
        this.transport = nodemailer.createTransport({
            host: 'smtp.gmail.com', 
            port: 587,
            secure: false, 
            auth: {
                user: config.MAIL_USER,
                pass: config.MAIL_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        });
    }

    send = async (user, subject, html) => {
        const opt = {
            from: config.MAIL_USER,
            to: user,
            subject,
            html
        };

        try {
            const result = await this.transport.sendMail(opt);
            logger.info(`Email sent to ${user} successfully`);
            return result;
        } catch (error) {
            logger.error(`Error sending email to ${user}: ${error.message}`);
            throw error; 
        }
    };
}