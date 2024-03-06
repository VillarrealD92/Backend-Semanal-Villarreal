import { Router } from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct} from '../controllers/products.controllers.js';
import { authorization} from '../middlewares/middlewares.js';
import { uploader } from '../utlis/multer.js';
import passport from 'passport';

const router = Router();

router.get('/',
passport.authenticate('current', { session: false }),
getProducts
)

router.get('/:pid', getProductById);

router.post('/',
uploader.array('thumbnails', 3),
passport.authenticate('current', { session: false }),
authorization(['admin', 'premium']),
createProduct);

router.put("/:pid", 
uploader.array('thumbnails', 3),
passport.authenticate('current', { session: false }),
authorization(['admin']),
updateProduct );

router.delete("/:pid", 
passport.authenticate('current', { session: false }),
authorization(['admin', 'premium']),
deleteProduct )

export default router