import { Router } from "express";
import { checkRegisteredUser, auth, checkAdminPermissions, checkUserPermissions } from "../middlewares/middlewares.js"
import { cartView, productsView, checkCartSession, checkOutView, realTimeProducts, index, chat, register, login, profile } from "../controllers/views.controller.js";

const router = Router ()

router.get("/", checkRegisteredUser, login)
router.get("/register", checkRegisteredUser, register)
router.get("/profile", auth, profile)

router.get("/realtimeproducts", checkAdminPermissions, realTimeProducts)

router.get("/chat", checkUserPermissions, chat)

router.get("/cart", checkCartSession)

router.get("/cart/:cid", cartView)

router.get("/products", productsView)

router.get("/index", index)

router.get("/checkout", checkOutView)

export default router
