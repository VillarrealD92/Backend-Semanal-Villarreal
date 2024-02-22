import { productService } from "../services/index.repositories.js";

export const getProducts = async (req, res)=> {
    try {
        const limit = parseInt(req.query.limit) || 3;
        const page = parseInt(req.query.page) || 1;
        const query = req.query.query || "";
        const order = req.query.sort === "Desc" ? -1 : 1;
        const sortValue = req.query.sort ? {price: order} : '-createdAt';
 
        const search = {};
        if (query) {
            search.title = { "$regex": query, "$options": "i" }; 
            search.category = { "$regex": query, "$options": "i" };
        }

        const result = await productService.getProducts(search, limit, page, query, sortValue); 

        result.payload = result.docs;
        result.query = query;
        result.sortOrder = sortValue;
        result.status = "success";
        delete result.docs;

        console.log(result);

        res.status(200).send(result);
    } catch (error) {
        console.log("Error: " + error);
        res.status(500).send(error);
    }
};

export const getProductById = async (req, res) => {
    try {
        const id = req.params.pid;
        const productRequired = await productService.getProductById(id);
        productRequired ? res.json({ productRequired }) : res.json("Not Found");
    } catch (error) {
        console.log("Error " + error);
        res.status(500).send(error);
    }
};

// crear un nuevo producto
export const createProduct = async (req, res) => {
    try {
        if (req.user.role !== "premium") {
            return res.status(403).json({ message: "No tiene permiso para crear productos." });
        }

        const product = req.body;
        const { title, category, description, price, thumbnail, code, stock } = product;
        
        let owner;

        if (req.user) {
            owner = req.user._id; 
        } else {
            owner = "admin";
        }
        const productAdded = await productService.createProduct(title, category, description, price, thumbnail, code, stock, owner);

        res.json(productAdded);
    } catch (error) {
        console.error("Error al crear el producto:", error);
        res.status(500).send(error);
    }
};

// actualizar un producto
export const updateProduct = async (req, res) => {
    try {
        const id = req.params.pid;
        const updateRequest = req.body;

        if (req.user.role === "premium" && req.user._id !== updateRequest.owner) {
            return res.status(403).json({ message: "No tiene permiso para actualizar este producto." });
        }

        const productUpdated = await productService.updateProduct(id, updateRequest);
        
        res.status(200).send({ productUpdated });
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
};

// eliminar un producto
export const deleteProduct = async (req, res) => {
    try {
        const id = req.params.pid;

        if (req.user.role === "premium") {
            const product = await productService.getProductById(id);
            if (!product || product.owner !== req.user._id) {
                return res.status(403).json({ message: "No tiene permiso para eliminar este producto." });
            }
        }

        await productService.deleteProduct(id);
        res.status(200).send("Product ID " + id + " has been deleted");
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }    
};