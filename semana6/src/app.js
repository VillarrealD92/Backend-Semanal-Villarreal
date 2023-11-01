import express from 'express';
import handlebars from 'express-handlebars'
import { Server } from 'socket.io';
import http from 'http';
import __dirname from './utils.js';
import ProductManager from './manager/ProductManager.js';
import { CartManager } from './manager/cartManager.js';

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);

const productManager = new ProductManager('./api/servicios.json');
const cartManager = new CartManager();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', handlebars.engine());

app.set('view engine', 'handlebars');

app.use(express.static(`${__dirname}/public`));

app.get('/', async (req, res) => {
  const products = await productManager.getProducts();
  res.render('home', { products });
});

app.get('/realtimeproducts', async (req, res) => {
  const products = await productManager.getProducts();
  res.render('realTimeProducts', { products });
});

io.on('connection', async (socket) => {
  console.log('Nuevo usuario conectado');

  socket.on('updateProduct', async (productData) => {
    try {
      const productId = productData.productId;
      const updatedProductData = productData.updatedProductData;
      await productManager.updateProduct(productId, updatedProductData);

      io.emit('productUpdated', { productId, updatedProductData });
    } catch (error) {
      console.error('Error al actualizar el producto:', error.message);
    }
  });

  socket.on('deleteProduct', async (productId) => {
    try {
      await productManager.deleteProduct(productId);

      io.emit('productDeleted', productId);
    } catch (error) {
      console.error('Error al eliminar el producto:', error.message);
    }
  });
});

httpServer.listen(8080, () => console.log('Servidor activo en el puerto 8080'));