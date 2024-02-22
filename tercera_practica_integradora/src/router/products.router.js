import { Router } from "express" 
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from "../controllers/products.controller.js"
import { checkAdminPermissions } from "../middlewares/middlewares.js"

const router = Router()

router.get("/", getProducts)

router.get("/:pid", getProductById)

router.post("/", checkAdminPermissions, createProduct)

router.put("/:pid", checkAdminPermissions, updateProduct)

router.delete("/:pid", checkAdminPermissions, deleteProduct)

export default router
