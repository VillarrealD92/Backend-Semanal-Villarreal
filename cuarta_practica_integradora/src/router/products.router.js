import { Router } from "express" 
// import ProductManager from "../dao/fsManagers/ProductManager.js"
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from "../controllers/products.controller.js"
import { checkAdminPermissions } from "../middlewares/middlewares.js"
import passport from "passport"


const router = Router()

/* const juan = new ProductManager("./db.json") */

router.get("/", getProducts)

router.get("/:pid", getProductById)

router.post("/", passport.authenticate("jwt", { session: false }), checkAdminPermissions, createProduct)

router.put("/:pid", passport.authenticate("jwt", { session: false }), checkAdminPermissions, updateProduct)

router.delete("/:pid", passport.authenticate("jwt", { session: false }), checkAdminPermissions, deleteProduct)

export default router
