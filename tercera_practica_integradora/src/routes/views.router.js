import { Router } from "express";
import passport from "passport";
import {homeProducts, realTimeProducts, cartUser, register, login, profile, foundEmailPage } from "../controllers/views.controllers.js";
import {justPublicWithoutSession} from '../middlewares/middlewares.js'

const router=Router();

router.get('/', justPublicWithoutSession ,passport.authenticate('current', { session: false }), homeProducts);

router.get('/realTimeProducts', realTimeProducts );

router.get('/carts/:cid', cartUser)

router.get('/api/session/register', register );

router.get('/api/session/login', login);

router.get('/api/session/current',passport.authenticate('current', { session: false }), profile);

router.get('/api/session/foundEmailUser', foundEmailPage);

export default router