import { productService } from "../services/index.repositories.js"


export const getProducts = async (req, res)=> {
    try {
        const limit = parseInt(req.query.limit) || 3
        const page = parseInt(req.query.page) || 1
        const query = req.query.query || ""
        const order = req.query.sort === "Desc" ? -1 : 1
        const sortValue = req.query.sort? {price: order} :'-createdAt'
 
        const search = {}
        if (query) {
            search.title= { "$regex": query, "$options": "i" } 
            search.category= { "$regex": query, "$options": "i" }
        }

        const result = await productService.getProducts(search, limit, page, query, sortValue) 

        result.payload = result.docs
        result.query = query
        result.sortOrder = sortValue
        result.status = "succes"
        delete result.docs

        console.log(result);

        res.status(200).send(result)
    } catch (error) {
        console.log("Error: " + error);
        res.status(500).send(error)
    }
}

export const getProductById = async (req, res) => {
    try {
        const id=req.params.pid
        const productRequired = await productService.getProductById(id)
        productRequired? res.json( { productRequired } ) : res.json("Not Found")
        
    } catch (error) {
        console.log("Error " + error);
        res.status(500).send(error)    
    }
}

export const createProduct = async (req,res) => {
    try {
        const product = req.body
        const { title, category, description, price, thumbnail, code, stock } = product
        const productAdded = await productService.createProduct(title, category, description, price, thumbnail, code, stock)

        res.json(productAdded)

    } catch (error) {
        console.log(error);
        res.status(500).send(error)
    }
}

export const updateProduct = async (req,res) =>{
    try {
        const id = req.params.pid
        const updateRequest = req.body

        const productUpdated = await productService.updateProduct(id, updateRequest)
        
        res.status(200).send({productUpdated})

    } catch (error) {
        console.log(error);
        res.status(500).send(error)
    }
}

export const deleteProduct = async (req,res) => {
    try {
        const id=req.params.pid
        await productService.deleteProduct(id)
        res.status(200).send("Product ID " + id + " has been deleted")
    } catch (error) {
        console.log(error);
        res.status(500).send(error)
    }
    
}