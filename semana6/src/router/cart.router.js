import express from 'express';
import { CartManager } from '../manager/cartManager.js';

const cartRouter = express.Router();
const cartManager = new CartManager();

cartRouter.get('/', async (req, res) => {
  try {
    const carts = await cartManager.getCarts();
    res.json(carts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

cartRouter.get('/:cid', async (req, res) => {
  const cartId = parseInt(req.params.cid);
  try {
    const cart = await cartManager.getCartById(cartId);
    res.json(cart);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

cartRouter.post('/', async (req, res) => {
  try {
    const message = await cartManager.createCart();
    res.status(201).json({ message });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

cartRouter.delete('/:cid', async (req, res) => {
  const cartId = parseInt(req.params.cid);
  try {
    await cartManager.deleteCart(cartId);
    res.status(200).json({ message: 'Carrito eliminado exitosamente' });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

cartRouter.post('/:cid/product/:pid', async (req, res) => {
  const cartId = parseInt(req.params.cid);
  const productId = parseInt(req.params.pid);

  try {
    const message = await cartManager.addProductInCart(cartId, productId);
    res.status(201).json({ message });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default cartRouter;