import { cartModel } from '../models/carts.model.js';
import ProductManagerMDB from './productDBManager.js';

class CartManagerDB {

    async getCarts() {
        try {
            const carts = await cartModel.find();
            return carts;
        } catch (error) {
            return [];
        }
    }

    async createCart() {
        try {
            const result = await cartModel.create({});
            return result
        } catch (error) {
            return error;
        }
    }

    async getCartById(id) {
        try {
            const cart = await cartModel.findOne({_id:id});
            return cart;
        } catch (error) {
            return error
        }
    }

    async addProductCart(cid,pid){

        const products= new ProductManagerMDB();
        
        try{ 
            const carrito = await cartModel.findOne({_id:cid});
            const prod = await products.getProductById(pid);
        
            if(!prod) return 'Producto cannot be found'
            if(!carrito) return 'Carrito cannot be found'
        
            const product = carrito.products.find(p => p.product._id.toString() === pid);

            console.log(product);
        
            if(!product) {
                carrito.products.push({product: pid, quantity: 1});
            } 
                
            if(product){
                product.quantity ++;
            }
        
            await cartModel.updateOne({_id: cid}, carrito);
            return 'Se agrego el producto con exito'
        } catch (error) {
            return error
        }
        
        }
}

export default CartManagerDB