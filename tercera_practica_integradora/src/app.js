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
import mongoose from "mongoose"
import passport from "passport"
import initializePassport from "./config/passport.config.js"
import config from "./config/config.js"
import dotenv from "dotenv"
import cors from 'cors'
import { developmentLogger, productionLogger } from './utils/logger.js' 
import { chatService, productService } from "./services/index.repositories.js"

const app = express()
dotenv.config()
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(cors())

const {MONGO_URL, MONGO_DBNAME, PORT }= config

mongoose.connect(MONGO_URL, {dbName: MONGO_DBNAME})
    .then(() => {
        developmentLogger.info("Mongo DB connected") 
    })
    .catch(e => {
        developmentLogger.error("couldn't connect to DB " + e); 
        res.status(500).send(e)
    })   

app.use(session({
    store: MongoStore.create({
        mongoUrl: MONGO_URL,
        dbName: MONGO_DBNAME,
        ttl: 300
    }),    
    secret: "secret",
    resave: true,
    saveUninitialized: true
}))  

app.engine('handlebars', handlebars.engine())
app.use("/static", express.static(__dirname + "/public"))
app.set("views", __dirname+"/views")
app.set("view engine", "handlebars")

const port = config.port || PORT

const httpServer = app.listen( port, () => {
    productionLogger.info(`Server listening on port ${port}`); 
})
const socketServer = new Server(httpServer) 
socketServer.on("connection", async socket => {
    developmentLogger.info("Client connected");
    
    try {
        const products = await productService.getAllProducts()
        socket.emit("products", products)
    } catch (error) {
        developmentLogger.error(error);
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
            developmentLogger.error(error); 
        }
    })

    socket.on("deleteProduct", async id => {
        try {
            console.log(id);
            await productService.deleteProduct(id)
            const products = await productService.getAllProducts()
            socket.emit("products", products)
        } catch (error) {
            developmentLogger.error(error);
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
            developmentLogger.error("Server couldnt redirect chat log to users", error); 
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

app.get('/loggerTest', (req, res) => {
    developmentLogger.debug('Debug message');
    developmentLogger.http('HTTP message');
    developmentLogger.info('Info message');
    developmentLogger.warning('Warning message');
    developmentLogger.error('Error message');
    developmentLogger.fatal('Fatal message');
  
    productionLogger.debug('Debug message'); 
    productionLogger.http('HTTP message');
    productionLogger.info('Info message');
    productionLogger.warning('Warning message');
    productionLogger.error('Error message');
    productionLogger.fatal('Fatal message');
  
    res.send('Logs registrados');
  });