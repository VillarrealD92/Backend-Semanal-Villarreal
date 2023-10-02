class ProductManager {    
    constructor(){
        this.products = []
        this.idCounter = 1; 
    }

    createId (){
        return this.idCounter++; 
    }

    validations(product){
        for (const key in product) {
            if (typeof product[key] === 'undefined') {
                throw new Error(`ERROR: El campo '${key}' no puede estar indefinido`);
            }
        }

        const checkCode = this.products.find(p => p.code === product.code);
        if (checkCode) {
            throw new Error("ERROR: El código ya está en uso");
        }
    }

    getProductsById(id){
        const productById = this.products.find(p => p.id === id);
        if (productById) {
            return productById; 
        } else {
            throw new Error("Producto no encontrado");
        }
    }

    getProducts(){ 
        return this.products; 
    }

    addProduct(title, description, price, thumbnail, code, stock){ 
        const id = this.createId();
        
        const product = {
            id: id,
            title: title,
            description: description,
            price: price,
            thumbnail: thumbnail, 
            code: code, 
            stock: stock
        };
    
        this.validations(product);
        this.products.push(product);
    }
}

//  TEST 

const ana = new ProductManager();

ana.getProducts();
ana.addProduct("producto prueba", "Esto es una prueba", 100, "Sin imagen", "prueba", 125);
ana.getProducts();
console.log("\n");

try {
    ana.addProduct("producto prueba", "Esto es una prueba", 100, "Sin imagen", "prueba", 125);
} catch (error) {
    console.error(error.message);
}
console.log("\n");

try {
    const product1 = ana.getProductsById(1);
    console.log(product1);
} catch (error) {
    console.error(error.message);
}

try {
    ana.getProductsById(3);
} catch (error) {
    console.error(error.message);
}