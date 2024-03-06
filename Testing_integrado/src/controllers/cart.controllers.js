import { CartRepository, TicketRepository, ProductRepository } from "../services/index.services.js";
import { logger } from "../utlis/loggerDev.js"; 

export const createCart = async (req, res) => {
    try {
        const { user } = req;
        const cart = await CartRepository.createCart(user._id);
        res.send({ status: "success", payload: cart });
    } catch (error) {
        logger.error("Error creating cart: " + error.message); 
        res.status(500).send("Error creating cart");
    }
};

export const getCart = async (req, res) => {
    try {
        const idCart = req.params.cid;
        const cartFound = await CartRepository.getCartById(idCart);
        if (!cartFound) return res.status(404).send("Cart not found");
        req.logger.info(JSON.stringify(cartFound));
        return res.send({ status: "success", payload: cartFound });
    } catch (error) {
        logger.error("Error retrieving cart: " + error.message);
        res.status(500).send("Error retrieving cart");
    }
};

export const addProductCart = async (req, res) => {
    try {
        const creator = req.user;
        const cid = req.params.cid;
        const pid = req.params.pid;

        const productOwner = await ProductRepository.getProductById(pid);

        if (productOwner.owner === creator.user.email) {
            logger.warning("You can't add this product to cart because you are the creator");
            return res.status(401).send("You can't add this product to cart because you are the creator");
        }

        const product = await CartRepository.addProductCart(cid, pid);
        res.send({ result: product });
    } catch (error) {
        logger.error("Error adding product to cart: " + error.message);
        res.status(500).send("Error adding product to cart");
    }
};

export const deleteProductCart = async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const result = await CartRepository.deleteProductCart(cid, pid);
        res.send({ result: result });
    } catch (error) {
        logger.error("Error deleting product from cart: " + error.message);
        res.status(500).send("Error deleting product from cart");
    }
};

export const overwriteCart = async (req, res) => {
    try {
        const cid = req.params.cid;
        const result = await CartRepository.overwriteCart(cid, req.body);
        res.send({ result: result });
    } catch (error) {
        logger.error("Error overwriting cart: " + error.message);
        res.status(500).send("Error overwriting cart");
    }
};

export const updateQuantityProduct = async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const { quantity } = req.body;
        const result = await CartRepository.updateQuantity(cid, pid, quantity);
        res.send({ result: result });
    } catch (error) {
        logger.error("Error updating product quantity: " + error.message);
        res.status(500).send("Error updating product quantity");
    }
};

export const deleteCart = async (req, res) => {
    try {
        const cid = req.params.cid;
        const result = await CartRepository.deleteCart(cid);
        res.send({ result: result });
    } catch (error) {
        logger.error("Error deleting cart: " + error.message);
        res.status(500).send("Error deleting cart");
    }
};

export const purchase = async (req, res) => {
    try {
        const { user } = req;
        const cid = req.params.cid;
        const result = await TicketRepository.createTicket(cid, user);
        res.send({ resultPurchase: result });
    } catch (error) {
        logger.error("Error making purchase: " + error.message);
        res.status(500).send("Error making purchase");
    }
};