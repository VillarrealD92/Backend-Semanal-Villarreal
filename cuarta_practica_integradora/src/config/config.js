import dotenv from "dotenv"

dotenv.config()

export default {
    port: process.env.PORT || 8080,
    amdinUserName: process.env.ADMIN_USER,
    adminPassword: process.env.ADMIN_PASSWORD,
    mongoUrl: process.env.MONGO_URL,
    mongoDB: process.env.MONGO_DB,
    sessionSecret: process.env.SESSION_SECRET,
    githubClientId: process.env.GITHUB_CLIENT_ID,
    githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
    githubClientCallback: process.env.GITHUB_CLIENT_CALLBACK,
    jwtSign: process.env.JWT_SIGN,
    environment: process.env.ENVIRONMENT,
    mailService: process.env.MAIL_SERVICE,
    mailUser: process.env.MAIL_USER,
    mailPass: process.env.MAIL_PASS,
    mailPort: process.env.MAIL_PORT
}