import { Router } from "express";
import productModel from "../dao/models/products.model.js";
import CartManagerDB from "../dao/mongo/cartDBManager.js";
import cartModel from "../dao/models/carts.model.js";

const router = Router();

function justPublicWitoutSession(req, res, next) {
    if(!req.session?.user) return res.redirect('/api/session/login')
    
    return next()
}

function auth(req, res, next) { 
    if(req.session?.user)  res.redirect('/')

    return next()
}

router.get('/', justPublicWitoutSession,  async (req, res) => {
    try {
        const limit = parseInt(req.query?.limit ?? 10);
        const page = parseInt(req.query?.page ?? 1);
        const query = req.query?.query ?? '';
        const stock = parseInt(req.query?.stock);
        const search = {};
        const sort = req.query?.sort ?? '0';

        if (page < 1 || !Number.isInteger(page)) {
            return res.status(400).send({ error: 'Invalid page number' });
        }

        if (query) {
            search["$or"] = [
                { title: { "$regex": query, "$options": "i" } },
                { category: { "$regex": query, "$options": "i" } }
            ];
        }

        if (!isNaN(stock)) {
            if (stock > 0) {
                search.stock = { $gt: 0 }; 
            } else {
                return res.status(400).send({ error: 'Invalid stock value' });
            }
        }

        
        const totalCount = await productModel.countDocuments(search);
        const totalPages = Math.ceil(totalCount / limit);

        if (page > totalPages) {
            return res.status(400).send({ error: 'Page does not exist' });
        }

        const options = {
            limit: limit,
            page: page,
            lean: true,
        }

        if (sort != '0') {
            options["sort"] = { price: sort == 'asc' ? 1 : -1 }
        }

        const productsDB = await productModel.paginate(search, options);

        productsDB.payload = productsDB.docs;
        productsDB.status = 'success';
        productsDB.query = query;
        productsDB.sortCero = sort === '0';
        productsDB.sortAsc = sort === 'asc';
        productsDB.sortDesc = sort === 'desc';
        delete productsDB.docs;

        console.log(productsDB);

        res.render('home', {
            products: productsDB.payload,
            style: 'index.css',
            productData: productsDB,
            userName:req.session.user
        });

    } catch (error) {
        return res.status(500).send({ error: 'Internal server error' });
    }
});

router.get('/realTimeProducts', async (req, res) => {
    try {
        const productsDB = await productModel.paginate({}, {
            limit: 10,
            page: 1,
            lean: true,
        });

        productsDB.payload = productsDB.docs;
        productsDB.status = 'success';
        delete productsDB.docs;

        res.render('realTimeProducts', {
            products: productsDB.payload,
            style: 'styles.css'
        });

    } catch (error) {
        return res.status(500).send({ error: 'Internal server error' });
    }
});

router.get('/carts/:cid', async (req, res) => {
    try {
        const { cid } = req.params;

        const cart = new CartManagerDB();

        const cartSearch = await cartModel.findOne({ _id: cid }).lean().exec();

        if (!cartSearch) {
            return res.status(404).send({ error: 'Cart not found' });
        }

        console.log(cartSearch.products);

        res.render('cart', {
            style: 'index.css',
            cart: cartSearch.products
        });

    } catch (error) {
        return res.status(500).send({ error: 'Internal server error' });
    }
});

router.get('/api/session/register', auth, (req,res)=>{

    return res.render('register');
});

router.get('/api/session/login', auth, (req,res)=>{

    return res.render('login');
});

router.get('/api/session/profile', justPublicWitoutSession, (req,res)=>{

    const user= req.session.user

    return res.render('profile',{ userData:user });
});


export default router;


