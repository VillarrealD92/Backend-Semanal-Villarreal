import nodemailer from 'nodemailer';
import config from '../config/config.js';

export default class Mail {
    constructor() {
        this.transport = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            auth: {
                user: config.MAIL_USER,
                pass: config.MAIL_PASS
            }
        })
    }

    send = async(user, subject, html) => {
        const opt = {
            from: config.MAIL_USER,
            to: user,
            subject,
            html
        }

        const result =await this.transport.sendMail(opt)

        return result
    }

}