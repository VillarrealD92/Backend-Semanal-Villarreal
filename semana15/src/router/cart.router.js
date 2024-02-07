import { Router } from "express";
import { addProductToCart, changeProductQuantityInCart, createCart, deleteProductFromCart, emptyCart, insertProductsToCart, checkOutProcess } from "../controllers/carts.controller.js";
import { checkUserPermissions } from "../middlewares/middlewares.js";

const router = Router()

router.post("/", createCart)

router.post("/:cid/product/:pid", checkUserPermissions , addProductToCart)

router.delete("/:cid/products/:pid", deleteProductFromCart)

router.delete("/:cid", emptyCart)

router.put("/:cid/products/:pid", changeProductQuantityInCart)

router.put("/:cid", insertProductsToCart)

router.post("/:cid/purchase", checkOutProcess)

export default router