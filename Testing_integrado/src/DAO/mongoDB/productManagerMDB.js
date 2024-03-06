import { productModel } from "../mongoDB/models/product.model.js";
import { logger } from "../../utlis/loggerDev.js"; 

class ProductManagerMDB {

    async getProducts() {
        try {
            const products = await productModel.find();
            return products;
        } catch (error) {
            logger.error("Error in getProducts: " + error.message); 
            return [];
        }
    }

    async addProduct(product) {
        const { title, description, code, price, stock, category, thumbnails, owner } = product;

        if (!title || !description || !code || !price || !stock || !category) {
            logger.error("Error in addProduct: Invalid product"); 
            return 'Error al crear el producto';
        }

        const newProduct = {
            title,
            description,
            code,
            price,
            status: true,
            stock,
            category,
            thumbnails: thumbnails ?? [],
            owner 
        }

        try {
            const result = await productModel.create(newProduct);
            logger.info("Product added successfully"); 
            return newProduct;
        } catch (error) {
            logger.error("Error in addProduct: " + error.message); 
            return error;
        }
    }

    async getProductById(id) {
        try {
            const product = await productModel.findOne({ _id: id });
            return product;
        } catch (error) {
            logger.error("Error in getProductById: " + error.message);
            return false;
        }
    }

    async deletProduct(id) {
        try {
            const product = await productModel.findOne({ _id: id });
            const result = await productModel.deleteOne({ _id: id });
            logger.info("Product deleted successfully");
            return product;
        } catch (error) {
            logger.error("Error in deletProduct: " + error.message);
            return false;
        }
    }

    async updateProduct(id, prod) {
        try {
            const dataProds = await productModel.findOne({ _id: id });
            const { title, description, code, price, stock, category, thumbnails } = prod;
            const updatedProduct = {
                title: title || dataProds.title,
                description: description || dataProds.description,
                code: code || dataProds.code,
                price: price || dataProds.price,
                stock: stock || dataProds.stock,
                category: category || dataProds.category,
                thumbnails: thumbnails || dataProds.thumbnails
            };
            const result = await productModel.updateOne({ _id: id }, updatedProduct);
            logger.info("Product updated successfully");
            return updatedProduct;
        } catch (error) {
            logger.error("Error in updateProduct: " + error.message);
            return false;
        }
    }
}

export default ProductManagerMDB;