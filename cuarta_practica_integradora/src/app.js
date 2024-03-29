import express from "express"
import handlebars from "express-handlebars"
import session from "express-session"
import MongoStore from "connect-mongo"
import __dirname from "./utils.js"
import { Server } from "socket.io"
import viewsRouter from "./router/views.router.js"
import cartRouter from "./router/cart.router.js"
import productsRouter from "./router/products.router.js"
import sessionRouter from "./router/sessions.router.js"
import usersRouter from './router/users.router.js';
import loggerRouter from "./router/logger.router.js"
import mongoose from "mongoose"
import passport from "passport"
import initializePassport from "./config/passport.config.js"
import config from "./config/config.js"
import dotenv from "dotenv"
import cors from 'cors'
import cookieParser from "cookie-parser"
import { chatService, productService } from "./repositories/index.repositories.js"
import { addLogger } from "./middlewares/logger.js"
import SwaggerUIexpress from "swagger-ui-express"
import swaggerJSDoc from "swagger-jsdoc"
import Mail from "./modules/mail.module.js"



const app = express()
app.use(addLogger)
app.use(cookieParser())
dotenv.config()
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(cors())


const { mongoUrl, mongoDB, port } = config

mongoose.connect(mongoUrl, {dbName: mongoDB})
    .then(() => {
        console.log("Mongo DB connected")
    })
    .catch(e => {
        console.log("Couldnt connect with Mongo DB, error message: "+e);
        res.status(500).send(e)
    })   


const swaggerOptions = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "eCommerce Backend Documentation",
            description: "Here you can find the backend documentation for eCommerce backend project"
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
  }
const specs = swaggerJSDoc(swaggerOptions)
app.use("/apidocs", SwaggerUIexpress.serve, SwaggerUIexpress.setup(specs))

const sessionSecret=config.sessionSecret
app.use(session({
    store: MongoStore.create({
        mongoUrl: mongoUrl,
        dbName: mongoDB,
        ttl: 300
    }),    
    secret: sessionSecret,
    resave: true,
    saveUninitialized: true
}))  

app.engine('handlebars', handlebars.engine())
app.use("/static", express.static(__dirname + "/public"))
app.set("views", __dirname+"/views")
app.set("view engine", "handlebars")


const httpServer = app.listen( port, () => console.log("Listening in "+ port ))
const socketServer = new Server(httpServer) 
socketServer.on("connection", async socket => {
    console.log("Client connected")
    
    try {
        const products = await productService.getAllProducts()
        socket.emit("products", products)
    } catch (error) {
        console.log(error);
        res.send(error)
    }
    
    socket.on("newProduct", async data =>{
        try {
            console.log(data);
            const {title, category, description, price, code, stock} = data
            const newProduct = await productService.createProduct({title, category, description, price, code, stock}) 
            console.log({newProduct});
            const products = await productService.getAllProducts()
            socket.emit("products", products)
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    })

    socket.on("deleteProduct", async id => {
        try {
            console.log(id);
            await productService.deleteProduct(id)
            const products = await productService.getAllProducts()
            socket.emit("products", products)
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    })
    
    socket.on("message", async ({user, message}) => {
        try {
            console.log({user, message});
            await chatService.createMessage(user, message)
            const logs = await chatService.getMessages()
            socketServer.emit("logs", logs)
        } catch (error) {
            console.log("Server couldnt redirect chat log to users");
            res.send(error)
        }
    })
})


initializePassport()
app.use(passport.initialize())
app.use(passport.session()) 


app.use("/", viewsRouter)
app.use("/api/products", productsRouter)
app.use("/api/carts", cartRouter)
app.use("/api/session", sessionRouter)
app.use('/api/users', usersRouter);
app.use("/loggerTest", loggerRouter)

const mail = new Mail
app.get("/mail", async(req,res) =>{
    mail.send(config.mailUser,"TEST",`<h1>TEST</h1>`)
    return res.send("check your email")
})