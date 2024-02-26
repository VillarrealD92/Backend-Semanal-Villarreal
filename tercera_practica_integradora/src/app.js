import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/cart.router.js';
import productsViews from './routes/views.router.js';
import messageRouter from './routes/messages.router.js';
import sessionRouter from './routes/session.router.js';
import loggerRouter from './routes/logger.router.js';
import userRouter from './routes/user.router.js';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import __dirname from './utils.js';
import DBMessageManager from './DAO/mongoDB/messageManager.js';
import initializePassport from './config/passport.config.js';
import passport from 'passport';
import config from './config/config.js';  
import { addLoggerDevelopment } from './utlis/loggerDev.js';1

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(addLoggerDevelopment);

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(cookieParser());

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use('/', productsViews);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/messages', messageRouter);
app.use('/api/session', sessionRouter);
app.use('/api/loggerTest', loggerRouter);
app.use('/api/user', userRouter);

const {PORT }= config
const httpServer= app.listen(PORT, () => console.log(`Servidor activo en el puerto ${PORT}`))

const io = new Server(httpServer);

const messages = new DBMessageManager();

io.on('connection', async socket => {

    console.log("Nuevo usuario conectado");

    const messageHistory = await messages.sendMessages();

    socket.on('message', async data => {
        const newMessage = await messages.addMessage(data);
        messageHistory.push(data);

        io.emit('messagesLogs', messageHistory);
    });

    socket.on('userConnect', data => {
        socket.emit('messagesLogs', messageHistory)
    })
});

export { io }