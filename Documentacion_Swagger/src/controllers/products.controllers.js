import { ProductRepository } from "../services/index.services.js";

export const getProducts = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit);

        const productList = await ProductRepository.getProducts();

        if (!limit || isNaN(limit)) {
            return res.send({ products: productList });
        }

        const limitProducts = productList.slice(0, limit);

        return res.send({ products: limitProducts });
    } catch (error) {
        return res.status(500).send({ status: 'error', result: error.message });
    }
};

export const getProductById = async (req, res) => {
    try {
        const productId = req.params.pid;

        const product = await ProductRepository.getProductById(productId);

        if (!product) {
            req.logger.error("Product not found");
            return res.status(404).send({ error: "Product not found" });
        }

        req.logger.info("Product found");
        return res.send({ product: product });
    } catch (error) {
        return res.status(500).send({ status: 'error', result: error.message });
    }
};

export const createProduct = async (req, res) => {
    try {
        if (req.files) {
            req.body.thumbnails = [];
            req.files.forEach((file) => req.body.thumbnails.push(file.filename));
        }

        const productList = await ProductRepository.getProducts();
        const productRepeat = productList.some(prod => prod.code === req.body.code);

        if (productRepeat) {
            req.logger.warning("The product already exists");
            return res.status(400).send({ status: "Este producto ya existe, por favor verifique" });
        }

        const requiredFields = ['code', 'name', 'description', 'price', 'category', 'stock'];
        const missingFields = requiredFields.filter(field => !req.body.hasOwnProperty(field) || req.body[field] === '');

        if (missingFields.length > 0) {
            req.logger.warning("The product is not complete");
            return res.status(400).send({ status: "Valores incompletos, por favor verifique" });
        }

        const creator = req.user;
        const finalProduct = req.body;

        if (creator.user.role !== 'admin') {
            finalProduct.owner = creator.user.email;
        }

        const newProduct = await ProductRepository.addProduct(finalProduct);

        return res.send({ status: "Producto Creado correctamente", result: newProduct });
    } catch (error) {
        return res.status(500).send({ status: 'error', result: error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        if (req.files) {
            req.body.thumbnails = [];
            req.files.forEach((file) => req.body.thumbnails.push(file.filename));
        }

        const productUpdated = await ProductRepository.updateProduct(req.params.pid, req.body);

        return res.send({ status: "Producto actualizado", result: req.body });
    } catch (error) {
        req.logger.error("Error to update product");
        return res.status(400).send({ status: 'error', message: "No se pudo actualizar el producto" });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const deleteProduct = await ProductRepository.deleteProduct(req.params.pid);

        if (deleteProduct) {
            return res.send({ status: 'Product deleted', payload: deleteProduct });
        }

        req.logger.error("Error deleting product");
        return res.status(404).send({ status: "Product not found" });
    } catch (error) {
        return res.status(500).send({ status: 'error', result: error.message });
    }
};