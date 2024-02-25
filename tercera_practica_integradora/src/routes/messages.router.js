import { Router } from "express";
import {messages} from "../controllers/views.controllers.js";
import passport from 'passport';
import { chatOnlyForUser, justPublicWitoutSession } from "../middlewares/middlewares.js";

const router = Router();

router.get('/',
justPublicWitoutSession,
passport.authenticate('current', { session: false }),
chatOnlyForUser('user'),
messages );

export default router;