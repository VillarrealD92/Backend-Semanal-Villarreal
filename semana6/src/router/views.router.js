import { Router } from "express";
import ProductManager from "../manager/ProductManager.js";

const router=Router();

const productList= new ProductManager("./api/servicios.json");
const products= await productList.getProducts();

router.get('/', async (req,res)=>{

res.render('home',{
    products:products,
});

});

router.get('/realtimeproducts', async (req,res)=>{

res.render('realTimeProducts',{
    products:products,
});

});


export default router