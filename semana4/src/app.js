import express from 'express';
import ProductManager from './ProductManager.js'; 
const app = express();


const productManager = new ProductManager('./servicios.json');


app.use(express.json());


app.get('/products', async (req, res) => {
  try {
    const limit = req.query.limit; 
    const products = await productManager.getProducts();

    if (limit) {
      const limitedProducts = products.slice(0, limit);
      res.json(limitedProducts);
    } else {
      res.json(products);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.get('/products/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const product = await productManager.getProductsById(productId);
    res.json(product);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});


const port = 8080;

app.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});