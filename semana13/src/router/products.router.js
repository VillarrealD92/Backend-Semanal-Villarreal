import { Router } from 'express';
import { getProducts, productId, createProduct, updateProduct, deleteProduct } from '../controller/products.controller.js';
import { uploader } from '../utils/multer.js';

const router = Router();

router.get('/', getProducts);

router.get('/:pid', productId);

router.post('/', uploader.array('thumbnails', 3), createProduct);

router.put("/:pid", uploader.array('thumbnails', 3), updateProduct );

router.delete("/:pid", deleteProduct )

export default router