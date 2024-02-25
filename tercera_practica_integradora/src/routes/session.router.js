import { Router } from "express";
import passport from 'passport';
import { register, login, current, githubcallback, userId, sendEmail, recoverPassword, changePassword, logout } from "../controllers/session.controllers.js";

const router = Router();

router.post('/register', passport.authenticate('register', { failureRedirect: '/' }), register )

router.post('/login', passport.authenticate('login', { failureRedirect: '/' }), login );

router.post('/foundEmailUser/:email', sendEmail );

router.get('/recoverPassword/:token', recoverPassword );

router.post('/recoverPassword/:pass', changePassword);

router.post('/current', current );

router.get('/github',
passport.authenticate('github', { scope: ['user:email'] }),
async (req, res) => { })

router.get('/githubcallback',passport.authenticate('github', { failureRedirect: '/error' }),githubcallback);

router.get("/logout", logout)

router.get('/user', passport.authenticate('current', { session: false }), userId)

export default router