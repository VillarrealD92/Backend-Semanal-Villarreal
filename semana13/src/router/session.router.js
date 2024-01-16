import { Router } from "express";
import passport from 'passport';
import { register, login, current, githubcallback } from "../controller/session.controller.js";

const router = Router();

router.post('/register', passport.authenticate('register', { failureRedirect: '/' }), register )

router.post('/login', passport.authenticate('login', { failureRedirect: '/' }), login );

router.post('/current', current );

router.get('/github',passport.authenticate('github', { scope: ['user:email'] }),async (req, res) => { })

router.get('/githubcallback',passport.authenticate('github', { failureRedirect: '/error' }),githubcallback)

export default router