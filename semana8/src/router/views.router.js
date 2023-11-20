import { Router } from "express";
import productModel from "../dao/models/products.model.js";

const router=Router();


router.get('/', async (req,res)=>{
try {

    const productsDB= await productModel.find().lean().exec();

    res.render('home',{
        products:productsDB,
        style: 'index.css'
    });
} catch (error) {
    return error;
}

});

router.get('/realTimeProducts', async (req,res)=>{
try {

    const productsDB= await productModel.find().lean().exec();

    res.render('realTimeProducts',{
        products:productsDB,
        style: 'index.css'
    });
} catch (error) {
    return error;
}
});


export default router