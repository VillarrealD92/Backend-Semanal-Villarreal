import { CartRepository, TicketRepository, ProductRepository } from "../services/index.services.js";

export const createCart = (req, res) => {

    const {user}= req.user;
    try {

        const cart = CartRepository.createCart(user._id);

        res.send({ status: "success", payload: cart })

    } catch (error) {
        return error
    }
}

export const getCart = async (req, res) => {
    try {

        const idCart = req.params.cid;
        const cartFound = await CartRepository.getCartById(idCart);

        if (!cartFound) return (res.status(400).send(false));

        req.logger.info(JSON.stringify(cartFound));

        return res.send({ status: cartFound })
    } catch (error) {
        return false
    }
}

export const addProductCart = async (req, res) => {

    try {
        const creator = req.user
        const cid = req.params.cid;
        const pid = req.params.pid;

        const productOwner = await ProductRepository.getProductById(pid);

        if(productOwner.owner == creator.user.email){
            req.logger.warning("You can't add this producto to cart, becouse you are the creator");
           return res.status(401).send({error:"You can't add this producto to cart, becouse you are the creator"});
        }

        const product = await CartRepository.addProductCart(cid, pid);

        res.send({ result: product })

    } catch (err) {
        res.status(500).send("No se pudo agregar el producto" + err)
    }

}

export const deletProductCart = async (req, res) => {

    try {
        const cid = req.params.cid;
        const pid = req.params.pid;

        const result = await CartRepository.deletProductCart(cid, pid)

        res.send({ result: result })

    } catch (err) {
        res.status(500).send("Error borrando el carrito" + err)
    }

}

export const overwriteCart= async (req, res) => {

    try {
        const cid = req.params.cid;

        const result = await CartRepository.overwriteCart(cid, req.body)

        res.send({ result: result })

    } catch (err) {
        res.status(500).send("Error al editar el carrito" + err)
    }

}

export const uptadeQuantityProduct= async (req, res) => {

    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const {quantity}= req.body;

        const result = await CartRepository.uptadeQuantity(cid,pid,quantity);

        res.send({ result: result })

    } catch (err) {
        res.status(500).send("Error quantity" + err)
    }

}

export const deletCart= async (req, res) => {

    try {
        const cid = req.params.cid;

        const result = await CartRepository.deletCart(cid)

        res.send({ result: result })

    } catch (err) {
        res.status(500).send("Error al vaciar el carrito" + err)
    }

}

export const purchase= async (req, res) =>{

try{

    const {user}= req.user;

    const cid = req.params.cid;

    const result= await TicketRepository.createTicket(cid, user);

    return res.send({resultPurchase: result})
}

catch (err) {
    res.status(400).send("No se pudo realizar la compra" + err)
}

}