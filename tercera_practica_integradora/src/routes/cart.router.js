import { Router } from 'express';
import { createCart, getCart, addProductCart, deletProductCart, overwriteCart, uptadeQuantityProduct, deletCart, purchase } from '../controllers/cart.controllers.js';
import passport from 'passport';
import { authorization } from '../middlewares/middlewares.js';

const router = Router()

router.post('/',
passport.authenticate('current', { session: false }),
createCart );

router.get('/:cid', getCart);

router.post('/:cid/product/:pid',
passport.authenticate('current', { session: false }),
authorization(['user']),
addProductCart)

router.delete('/:cid/product/:pid', deletProductCart)

router.put('/:cid', overwriteCart )

router.put('/:cid/product/:pid', uptadeQuantityProduct)

router.delete('/:cid', deletCart)

router.get('/:cid/purchase',
passport.authenticate('current', { session: false }),
authorization(['user']),
purchase)

export default router