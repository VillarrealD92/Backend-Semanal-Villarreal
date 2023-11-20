import { Router } from 'express';
import CartManagerDB from '../dao/mongo/cartDBManager.js';

const router = Router()

const cartsDB= new CartManagerDB();

router.post('/', (req,res)=>{
try {

const cartList= cartsDB.createCart();

res.send({status:"Cart created"})
} catch (error) {
    return error
}
});



router.get('/:cid', async (req,res)=>{
try {

const idCart= req.params.cid;
const cartFound= await cartsDB.getCartById(idCart);

if(!cartFound) return (res.status(400).send({status:"Error cart not founded"}));

return res.send({status:cartFound})
} catch (error) {
    
}
});

router.post('/:cid/product/:pid',async (req,res)=>{

    try{
        const cid = req.params.cid;
        const pid = req.params.pid;

        const product = await cartsDB.addProductCart(cid, pid);

        res.send({result:product})

    } catch (err) {
        res.status(500).send("Error al agregar producto al carrito" + err)
    }
    
})


export default router