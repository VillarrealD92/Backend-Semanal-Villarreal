import { cartModel } from '../mongoDB/models/cart.model.js';
import ProductManagerMDB from './productManagerMDB.js';
import { logger } from "../../utlis/loggerDev.js"; 

class CartManagerDB {
    async getCarts() {
        try {
            const carts = await cartModel.find();
            return carts;
        } catch (error) {
            logger.error("Error in getCarts: " + error.message); 
            return [];
        }
    }

    async createCart(userid) {
        try {
            const cartToAdd = {
                products: [],
                userCart: userid
            };
            const result = await cartModel.create(cartToAdd);
            return result;
        } catch (error) {
            logger.error("Error in createCart: " + error.message); 
            return error;
        }
    }

    async getCartById(id) {
        try {
            const cart = await cartModel.findOne({ userCart: id });
            return cart;
        } catch (error) {
            logger.error("Error in getCartById: " + error.message); 
            return error;
        }
    }

    async addProductCart(cid, pid) {
        const products = new ProductManagerMDB();
        try {
            const carrito = await cartModel.findOne({ userCart: cid });
            const prod = await products.getProductById(pid);
            if (!prod) return 'Product not found';
            if (!carrito) return 'Cart not found';
            const product = carrito.products.find(p => p.product._id.toString() === pid);
            if (!product) {
                carrito.products.push({ product: pid, quantity: 1 });
            } else {
                product.quantity++;
            }
            await cartModel.updateOne({ userCart: cid }, carrito);
            return 'Se agregó el producto correctamente';
        } catch (error) {
            logger.error("Error in addProductCart: " + error.message); 
            return error;
        }
    }

    async deletProductCart(cid, pid) {
        const products = new ProductManagerMDB();
        try {
            const carrito = await cartModel.findOne({ userCart: cid });
            const prod = await products.getProductById(pid);
            if (!prod) return 'Product not found';
            if (!carrito) return 'Cart not found';
            const productIndex = carrito.products.findIndex(p => p.product._id.toString() === pid);
            if (productIndex === -1) return 'Cart not found';
            carrito.products.splice(productIndex, 1);
            await cartModel.updateOne({ userCart: cid }, carrito);
            return 'Se eliminó el producto correctamente';
        } catch (error) {
            logger.error("Error in deletProductCart: " + error.message); 
            return error;
        }
    }

    async overwriteCart(cid, newProds) {
        try {
            const carrito = await cartModel.findOne({ userCart: cid });
            carrito.products = newProds;
            await cartModel.updateOne({ userCart: cid }, carrito);
            return 'Nuevo carrito guardado';
        } catch (error) {
            logger.error("Error in overwriteCart: " + error.message); 
            return error;
        }
    }

    async uptadeQuantity(cid, pid, newQuantity) {
        const products = new ProductManagerMDB();
        try {
            const carrito = await cartModel.findOne({ userCart: cid });
            const prod = await products.getProductById(pid);
            if (!prod) return 'Product not found';
            if (!carrito) return 'Cart not found';
            const product = carrito.products.find(p => p.product._id.toString() === pid);
            if (!product) return 'Product not found';
            product.quantity = newQuantity;
            await cartModel.updateOne({ userCart: cid }, carrito);
            return 'Se actualizó la cantidad del producto correctamente';
        } catch (error) {
            logger.error("Error in uptadeQuantity: " + error.message); 
            return error;
        }
    }

    async deletCart(cid) {
        try {
            const carrito = await cartModel.findOne({ userCart: cid });
            if (!carrito) return 'Carrito not found';
            carrito.products = [];
            await cartModel.updateOne({ userCart: cid }, carrito);
            return 'Se eliminaron todos los productos del carrito';
        } catch (error) {
            logger.error("Error in deletCart: " + error.message); 
            return error;
        }
    }
}

export default CartManagerDB;