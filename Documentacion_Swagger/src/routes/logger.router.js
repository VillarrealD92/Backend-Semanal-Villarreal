import { Router } from "express";
import { tryLoggers } from "../controllers/logger.controllers.js";

const router=Router();

router.get('/', tryLoggers);

export default router