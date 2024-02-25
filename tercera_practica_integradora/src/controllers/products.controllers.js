import { ProductRepository } from "../services/index.services.js";

export const getProducts = async (req, res) => {

    try {
        const limit = parseInt(req.query.limit);

        const productList = await ProductRepository.getProducts();

        if (!limit || !limit == Number) {
            return res.send({ products: productList });
        }

        const limitProducts = productList.slice(0, limit);

        return res.send({ products: limitProducts });

    } catch (error) {
        res.status(500).send({ status: 'error', result: error })
    }
}

export const productId = async (req, res) => {

    try {
        const productId = req.params.pid;

        const product = await ProductRepository.getProductById(productId);

        if (!product) {
            req.logger.error("Product not found")
            return res.status(400).send({ error: "Product not found" });
        }

        if (product) {
            req.logger.info("Product found")
            return res.send({ product: product });
        }
    }
    catch (error) {

        return error
    }

}

export const createProduct = async (req, res) => {

    try {

        if (req.files) {
            req.body.thumbnails = [];
            req.files.forEach((file) => req.body.thumbnails.push(file.filename));
        }

        const Listproducts = await ProductRepository.getProducts();

        const productRepeat = Listproducts.some(prod => prod.code === req.body.code);

        const checkOne = Object.keys(req.body).length;
        const checTwo = Object.values(req.body).includes("");

        if (productRepeat) {
            req.logger.warning("the product already exists")
            return res.status(400).send({ status: "Este producto ya existe, por favor verifique" });
        }

        if (checkOne < 6 || checTwo) {
            req.logger.warning("The product is not complete")
            return res.status(400).send({ status: "Valores imcompletos, por favor verifique" });
        }

        const creator= req.user

        const finalProduct= req.body

        if(creator.user.role !== 'admin'){
            finalProduct.owner= creator.user.email
        }

        const newProduct = await ProductRepository.addProduct(req.body);

        res.send({ status: "Producto Creado correctamente", result: req.body});

    } catch (error) {
        res.status(400).send({ status: error, result: "No se pudo crear el producto" })
    }
}

export const updateProduct = async (req, res) => {

    try {
        if (req.files) {
            req.body.thumbnails = [];
            req.files.forEach((file) => req.body.thumbnails.push(file.filename));
        }

        const productUpdated = await ProductRepository.updateProduct(req.params.pid, req.body)

        res.send({ status: "Producto actualizado", result: req.body });

    } catch (error) {
        req.logger.error("Error to update product")
        res.status(400).send({ status: error, message: "No se pudo actualizar el producto" });
    }

}

export const deletProduct = async (req, res) => {

    try {
        const deletProduct = await ProductRepository.deletProduct(req.params.pid);

        if(deletProduct) return res.send({ status: 'Product deleted', payload: deletProduct })

        if(!deletProduct){
            req.logger.error("Error deleting product")
            res.status(400).send({ status: "Product not found" })
        }

    } catch (error) {
        return error
    }

}