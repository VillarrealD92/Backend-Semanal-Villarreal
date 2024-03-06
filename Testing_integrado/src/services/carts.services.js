import { logger } from '../utlis/loggerDev.js'; 

export default class CartServices {

    constructor(dao){
        this.dao= dao;
    }
    
    getCarts = async () => {
        try {
            return await this.dao.getCarts();
        } catch (error) {
            logger.error(`Error getting carts: ${error.message}`);
            throw error;
        }
    }

    createCart = async (userid) => {
        try {
            return await this.dao.createCart(userid);
        } catch (error) {
            logger.error(`Error creating cart for user ${userid}: ${error.message}`);
            throw error;
        }
    }

    getCartById = async id => {
        try {
            return await this.dao.getCartById(id);
        } catch (error) {
            logger.error(`Error getting cart with id ${id}: ${error.message}`);
            throw error;
        }
    }

    addProductCart = async (cid, pid) => {
        try {
            return await this.dao.addProductCart(cid,pid);
        } catch (error) {
            logger.error(`Error adding product ${pid} to cart ${cid}: ${error.message}`);
            throw error;
        }
    }

    deletProductCart = async (cid, pid) => {
        try {
            return await this.dao.deletProductCart(cid,pid);
        } catch (error) {
            logger.error(`Error deleting product ${pid} from cart ${cid}: ${error.message}`);
            throw error;
        }
    }

    overwriteCart = async (cid, newProds) => {
        try {
            return await this.dao.overwriteCart(cid, newProds);
        } catch (error) {
            logger.error(`Error overwriting cart ${cid}: ${error.message}`);
            throw error;
        }
    }

    uptadeQuantity = async (cid,pid,newQuantity) => {
        try {
            return await this.dao.uptadeQuantity(cid, pid, newQuantity);
        } catch (error) {
            logger.error(`Error updating quantity of product ${pid} in cart ${cid}: ${error.message}`);
            throw error;
        }
    }

    deletCart = async cid => {
        try {
            return await this.dao.deletCart(cid);
        } catch (error) {
            logger.error(`Error deleting cart ${cid}: ${error.message}`);
            throw error;
        }
    }
}