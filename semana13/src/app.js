import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import productsRouter from './router/products.router.js';
import cartsRouter from './router/carts.router.js';
import productsViews from './router/views.router.js';
import messageRouter from './router/messages.router.js';
import sessionsRouter from './router/sessions.router.js';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import __dirname from './utils.js';
import mongoose from 'mongoose';
import passportConfig from './config/passport.config.js';
import passport from 'passport';
import MessageManagerDB from './dao/mongo/messageManager.js'
import config from './config/config.js'; 
import cookieParser from 'cookie-parser';

const app = express();

const {MONGO_URL, MONGO_DBNAME, PORT }= config

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));

app.use(session({
    store: MongoStore.create({
        mongoUrl: MONGO_URL,
        dbName: MONGO_DBNAME
    }),
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(cookieParser());

passportConfig.initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/products', productsRouter);
app.use('/products', productsViews);
app.use('/api/carts', cartsRouter);
app.use('/', productsViews);
app.use('/messages', messageRouter);
app.use('/api/session', sessionsRouter);


const httpServer = app.listen(PORT, () => console.log(`Servidor activo en el puerto ${PORT}`));
const io = new Server(httpServer);


mongoose.connect(MONGO_URL, { dbName: MONGO_DBNAME });

const messages = new MessageManagerDB();

io.on('connection', async socket => {
    console.log("Nuevo usuario conectado");

    const messageHistory = await messages.sendMessages();
    socket.emit('messagesLogs', messageHistory);

    socket.on('message', async data => {
        const newMessage = await messages.addMessage(data);
        io.emit('newMessage', newMessage);
    });

    socket.on('userConnect', () => {
        socket.emit('messagesLogs', messageHistory);
    });
});

export { io };
