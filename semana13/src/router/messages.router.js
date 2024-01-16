import { Router } from "express";
import {messages} from "../controller/views.controller.js";

const router = Router();

router.get('/', messages );

export default router;