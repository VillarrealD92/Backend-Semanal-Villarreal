import { Router } from 'express';
import { createCart, getCart, addProductCart, deleteProductCart, overwriteCart, updateQuantityProduct, deleteCart, purchase } from '../controllers/cart.controllers.js';
import passport from 'passport';
import { authorization } from '../middlewares/middlewares.js';

const router = Router()

router.post('/',
passport.authenticate('current', { session: false }),
createCart );

router.get('/:cid', getCart);

router.post('/:cid/product/:pid',
passport.authenticate('current', { session: false }),
authorization(['user','premium']),
addProductCart)

router.delete('/:cid/product/:pid', deleteProductCart)

router.put('/:cid', overwriteCart )

router.put('/:cid/product/:pid', updateQuantityProduct)

router.delete('/:cid', deleteCart)

router.get('/:cid/purchase',
passport.authenticate('current', { session: false }),
authorization(['user']),
purchase)

export default router