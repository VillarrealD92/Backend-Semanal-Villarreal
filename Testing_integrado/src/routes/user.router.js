import { Router } from "express";
import passport from 'passport';
import { changeRole } from "../controllers/user.controllers.js";

const router=Router();

router.get('/',passport.authenticate('current', { session: false }), changeRole);

export default router