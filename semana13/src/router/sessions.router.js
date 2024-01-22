import { Router } from "express";
import userModel from "../dao/models/users.model.js";
import passport from 'passport';
import bcrypt from 'bcrypt';
import config from '../config/config.js';

const { ADMINUSER, ADMINPASS } = config

const router = Router();

router.post('/register', async (req, res) => {
    const user = req.body;

    if (user.email == ADMINUSER && user.password != ADMINPASS) {
        return res.status(401).send({ error: 'Usuario no autorizado' });
    }

    if (user.email == ADMINUSER && user.password == ADMINPASS) {
        user.role = 'admin';
    }

    try {
        await userModel.create(user);
        return res.redirect('/api/session/login');
    } catch (error) {
        res.status(400).send({ fail: error });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) return res.status(404).send('User Not Found');

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) return res.status(401).send('Invalid Password');

    req.session.user = { email: user.email, name: user.name, role: user.role, age: user.age, last_name: user.last_name };

    return res.redirect('/');
});

router.post('/profile', async (req, res) => {
    req.session.destroy(error => {
        if (error) return res.send('Error al cerrar sesion');
    });
    return res.redirect('/api/session/login');
});

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => {});

router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/error' }), (req, res) => {
    console.log('Callback: ', req.user);
    req.session.user = req.user;
    console.log('User Session setted');
    res.redirect('/');
});

router.get('/current', async (req, res) => {
    try {
        const currentUserSession = req.session.user;
        if (!currentUserSession) {
            return res.status(401).json({ message: 'Usuario no autenticado' });
        }
        
        return res.status(200).json({ currentUser: currentUserSession });
    } catch (error) {
        return res.status(500).json({ error: 'Error al obtener el usuario actual', details: error });
    }
});

export default router;
