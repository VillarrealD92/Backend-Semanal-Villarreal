import nodemailer from "nodemailer"
import config from "../config/config.js"

export default class Mail {
    constructor(){
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

    sendTicketMail = async (user, ticket) => {
        const options = {
            from: "MundoCan",
            to: user,
            subject: "MundoCan - Purchase Ticket",
            html: `<h1>Your purchase has been successful!</h1>
                    <br>
                    <br>
                    <h3>Purchase Ticket: ${ticket}</h3>
                    <br>
                    <h5>Servicios Adquiridos:</h5>
                    <br>
                    <p>Thanks for choosing us!</p>
                    `
        }

        const result = await this.transport.sendMail(options)

        return result
    }

    sendPasswordMail = async (email, url) => {
        const options = {
            from: "MundoCan",
            to: email,
            subject: "MundoCan - RESTABLISH YOUR PASSWORD",
            html: `<h1>Restablish your password</h1>
            <br>
            <br>
            <h3>Click on the following link in order to restablish your password. This link will expire after 1 hour:</h3>
            <br>
            <a href="${url}">Click here</a>
            <br>
            ` 
        }

        const result = await this.transport.sendMail(options)
    }
}
