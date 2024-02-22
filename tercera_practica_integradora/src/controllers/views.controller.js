import { cartService, productService } from "../services/index.repositories.js";

export const cartView = async (req, res) => {
    try {
        const cartId = req.session.user.cart
        const populatedCart = await cartService.getPopulatedCart(cartId) 

        console.log({populatedCart});
        res.render("cart",{cart: populatedCart})
    } catch (error) {
        console.log(error);
        res.send("Something went wrong while getting products from cart")
    }
}

export const productsView = async (req, res)=> {
    try {
        const limit = parseInt(req.query.limit) || 10
        const page = parseInt(req.query.page) || 1
        const query = req.query.query || ""
        const sort = req.query.sort
        const sortValue= sort === "Desc" ? { price: -1 } : (sort === "Asc" ? { price: 1 } : {})

        const search = {}

        if (query) {
            search.$or = [
                { title: { "$regex": query, "$options": "i" } },
                { category: { "$regex": query, "$options": "i" } }
            ];
        }

        const result = await productService.getProducts(search, query, page, limit, sortValue)

        result.payload = result.docs
        result.query = query
        result.sortOrder = sortValue
        result.status = "success"
        result.user = req.session.user
        delete result.docs

        console.log(result);

        res.render("products", result)
    } catch (error) {
        console.log("Error: " + error);
        res.status(500).send(error)
    }
}

export const realTimeProducts = async (req, res) => {
    try {
        res.render("realTimeProducts", {
            db: await productService.getAllProducts()
        })     
    } catch (error) {
        res.status(500).send(error)
    }
}

export const index = (req, res) => {
    try {
        res.render("index")
    } catch (error) {
        res.status(500).send(error) 
    }
}

export const chat = (req, res) =>{
    try {
        res.render("chat", {})
    } catch (error) {
        res.status(500).send(error)
    }
}

export const register = (req,res) => {
    try {
        res.render("register", {})
    } catch (error) {
        res.status(500).send(error)
    }
}

export const login = (req,res) => {
    try {
        res.render("login", {})
    } catch (error) {
        res.status(500).send(error)
    }
}

export const profile = (req, res) => {
    try {
        const user = req.session.user
        console.log(user);
        res.render("profile", user)
    } catch (error) {
        res.status(500).send(error)
    }
}

export const checkOutView = async (req, res) => {
    try {
        res.render("checkOut",{})
    } catch (error) {
        res.status(500).send(error)
    }
}

export const checkCartSession = async (req, res) => {

    const cartSessionActive = req.session.user
    console.log(cartSessionActive);

    if(cartSessionActive != undefined){
        const cartId = req.session.user.cart
        return res.redirect(`/cart/${cartId}`)
    } else { return res.send("No cart has been created yet, please login!") }
}