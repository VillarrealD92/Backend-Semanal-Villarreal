import fs from 'fs';
import ProductManager from '../manager/ProductManager.js';

const productManager = new ProductManager('./api/servicios.json');

export class CartManager {
  constructor() {
    this.path = './api/carts.json';
    this.carts = [];
    this.loadCarts();
  }

  async loadCarts() {
    try {
      if (fs.existsSync(this.path)) {
        const data = await fs.promises.readFile(this.path, 'utf-8');
        this.carts = JSON.parse(data);
      }
    } catch (error) {
      throw new Error(`Error al cargar los carritos: ${error.message}`);
    }
  }

  async saveCarts() {
    try {
      await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, '\t'));
    } catch (error) {
      throw new Error(`Error al guardar los carritos: ${error.message}`);
    }
  }

  async createCart() {
    try {
      const newCart = {
        id: this.carts.length + 1,
        productos: [],
      };

      this.carts.push(newCart);
      await this.saveCarts();
      return 'Se creó el carrito correctamente';
    } catch (error) {
      throw new Error(`Error al crear el carrito: ${error.message}`);
    }
  }

  async getCarts(limit) {
    if (limit) {
      const limitedCarts = this.carts.slice(0, limit);
      return limitedCarts;
    } else {
      return this.carts;
    }
  }

  async getCartById(cid) {
    const cart = this.carts.find((c) => c.id === cid);
    if (cart) {
      return cart;
    } else {
      throw new Error('Carrito no encontrado');
    }
  }

  async addProductInCart(cid, pid) {
    try {
      const cart = this.carts.find((c) => c.id === cid);

      if (!cart) {
        throw new Error('Carrito no encontrado');
      }

      const product = await productManager.getProductsById(pid);

      if (product === 'Producto no encontrado') {
        throw new Error('Producto no encontrado');
      }

      const existingProduct = cart.productos.find((p) => p.pid === pid);

      if (existingProduct) {
        throw new Error('El producto ya está en el carrito');
      } else {
        cart.productos.push({ pid, quantity: 1 });
      }

      await this.saveCarts();
      return 'Se agregó el producto al carrito correctamente';
    } catch (error) {
      throw new Error(`Error al agregar el producto al carrito: ${error.message}`);
    }
  }

  async deleteCart(cid) {
    const cartIndex = this.carts.findIndex((c) => c.id === cid);
    if (cartIndex !== -1) {
      this.carts.splice(cartIndex, 1);
      await this.saveCarts();
      return 'Carrito eliminado exitosamente';
    } else {
      throw new Error('Carrito no encontrado');
    }
  }
}