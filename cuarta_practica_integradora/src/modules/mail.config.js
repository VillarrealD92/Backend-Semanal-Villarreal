import nodemailer from "nodemailer"
import config from "../config/config.js"

export default class Mail {
    constructor(){
        this.transport = nodemailer.createTransport({
            service: config.mailService,
            port: config.mailPort,
            auth:{
                user: config.mailUser,
                pass: config.mailPass
            }
    })}

    send = async (user, subject, html) => {
        const options = {
            from: config.mailUser,
            to: user,
            subject,
            html
          }
      
          const result = await this.transport.sendMail(options)
      
          return result
    }

    sendTicketMail = async (user, ticket) => {
        const options = {
            from: config.mailUser,
            to: user,
            subject: "eCommerce - Purchase Ticket",
            html: `<h1>Your purchase has been successful!</h1>
                    <br>
                    <br>
                    <h3>Purchase Ticket: ${ticket}</h3>
                    <br>
                    <br>
                    <p>Thanks for choosing us!</p>
                    `
        }

        const result = await this.transport.sendMail(options)

        return result
    }

    sendPasswordMail = async (email, url) => {
        const options = {
            from: config.mailUser,
            to: email,
            subject: "eCommerce - RESTABLISH YOUR PASSWORD",
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
