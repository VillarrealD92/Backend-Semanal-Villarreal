import { cartModel } from '../mongoDB/models/cart.model.js';
import ProductManagerMDB from './productManagerMDB.js';

class CartManagerDB {

    async getCarts() {

        try {
            const carts = await cartModel.find();
            return carts;

        } catch (error) {
            return [];
        }
    }

    async createCart(userid) {

        try {

            const cartToAdd = {
                products: [],
                userCart: userid
            }

            const result = await cartModel.create(cartToAdd);

            return result
        } catch (error) {

            return error;
        }

    }

    async getCartById(id) {

        try {
            const cart = await cartModel.findOne({ userCart: id });
            return cart;
        } catch (error) {
            return error
        }
    }

    async addProductCart(cid, pid) {

        const products = new ProductManagerMDB();

        try {
            const carrito = await cartModel.findOne({ userCart: cid });
            const prod = await products.getProductById(pid);

            if (!prod) return 'Product not found'
            if (!carrito) return 'Cart not found'

            const product = carrito.products.find(p => p.product._id.toString() === pid);

            console.log(product);

            if (!product) {
                carrito.products.push({ product: pid, quantity: 1 });
            }

            if (product) {
                product.quantity++;
            }

            await cartModel.updateOne({ userCart: cid }, carrito);
            return 'Se agrego el producto correctamente'
        } catch (error) {
            return error
        }

    }

    async deletProductCart(cid, pid) {

        const products = new ProductManagerMDB();

        try {
            const carrito = await cartModel.findOne({ userCart: cid });

            const prod = await products.getProductById(pid);

            if (!prod) return 'Product not found'
            if (!carrito) return 'Cart not found'

            const product = carrito.products.findIndex(p => p.product._id.toString() === pid);

            if (product === -1) return 'Cart not found'

            carrito.products.splice(product, 1);

            await cartModel.updateOne({ userCart: cid }, carrito);
            return 'Se elimino el producto correctamente'

        } catch (error) {
            return error
        }
    }

    async overwriteCart(cid, newProds){

        try {
            const carrito = await cartModel.findOne({ userCart: cid });

            const prods = newProds;

            carrito.products=prods

            await cartModel.updateOne({ userCart: cid }, carrito);
            return 'Nuevo carrito guardado'

        } catch (error) {
            return error
        }

    }

    async uptadeQuantity(cid,pid,newQuantity){

        const products = new ProductManagerMDB();

        try {

            const carrito = await cartModel.findOne({ userCart: cid });
            const prod = await products.getProductById(pid);

            if (!prod) return 'Product not found'
            if (!carrito) return 'Cart not found'

            const product = carrito.products.find(p => p.product._id.toString() === pid);

            if (!product) {
                return 'Product not found'
            }

            if (product) {
                product.quantity= newQuantity;
            }

            await cartModel.updateOne({ userCart: cid }, carrito);
            return carrito
            
        } catch (error) {
            return error
        }
    }

     async deletCart(cid){

        try {
            const carrito = await cartModel.findOne({ userCart: cid });

            if (!carrito) return 'Carrito not found'

            carrito.products=[];

            await cartModel.updateOne({ userCart: cid }, carrito);
            return 'Se eliminaron todos los productos del carrito'

        } catch (error) {
            return error
        }
     }
}

export default CartManagerDB