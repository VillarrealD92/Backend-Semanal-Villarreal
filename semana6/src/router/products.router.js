import express from 'express';
import { __dirname } from '../utils.js'; 
import ProductManager from '../manager/ProductManager.js';
import { uploader } from '../utils.js'; 

const productRouter = express.Router();
const productManager = new ProductManager(__dirname + '/api/servicios.json');

productRouter.get('/', async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

productRouter.get('/:pid', async (req, res) => {
  const productId = parseInt(req.params.pid);
  try {
    const product = await productManager.getProductsById(productId);
    res.json(product);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

productRouter.post('/', uploader.single('thumbnail'), async (req, res) => {
  try {
    const { title, description, price, code, stock } = req.body;
    const thumbnail = req.file.filename; 
    await productManager.addProduct(title, description, price, thumbnail, code, stock);
    io.emit('newProduct', { title, description, price, thumbnail, code, stock });
    res.status(201).json({ message: 'Producto creado exitosamente' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

productRouter.put('/:pid', async (req, res) => {
  const productId = parseInt(req.params.pid);
  try {
    const updatedProductData = req.body;
    await productManager.updateProduct(productId, updatedProductData);
    io.emit('productUpdated', { title, description, price, thumbnail, code, stock });
    res.status(200).json({ message: 'Producto actualizado exitosamente' });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

productRouter.delete('/:pid', async (req, res) => {
  const productId = parseInt(req.params.pid);
  try {
    await productManager.deleteProduct(productId);
    io.emit('productDeleted', { title, description, price, thumbnail, code, stock });
    res.status(200).json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});



export default productRouter;