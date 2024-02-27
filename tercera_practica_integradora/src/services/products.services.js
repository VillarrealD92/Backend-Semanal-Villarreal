import { logger } from '../utlis/loggerDev.js';

export default class ProductServices {

    constructor(dao) {
        this.dao = dao;
    }

    async getProducts() {
        try {
            return await this.dao.getProducts();
        } catch (error) {
            logger.error(`Error getting products: ${error.message}`);
            throw error;
        }
    }

    async addProduct(product) {
        try {
            return await this.dao.addProduct(product);
        } catch (error) {
            logger.error(`Error adding product: ${error.message}`);
            throw error;
        }
    }

    async getProductById(id) {
        try {
            return await this.dao.getProductById(id);
        } catch (error) {
            logger.error(`Error getting product by id ${id}: ${error.message}`);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            return await this.dao.deleteProduct(id);
        } catch (error) {
            logger.error(`Error deleting product with id ${id}: ${error.message}`);
            throw error;
        }
    }

    async updateProduct(id, product) {
        try {
            return await this.dao.updateProduct(id, product);
        } catch (error) {
            logger.error(`Error updating product with id ${id}: ${error.message}`);
            throw error;
        }
    }
}