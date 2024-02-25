export default class ProductServices {

    constructor(dao) {
        this.dao = dao
    }

    getProducts = async () => { return this.dao.getProducts() }
    addProduct = async product => { return this.dao.addProduct(product) }
    getProductById = async id => { return this.dao.getProductById(id) }
    deletProduct = async id => { return this.dao.deletProduct(id) }
    updateProduct = async (id, product) => { return this.dao.updateProduct(id, product) }

}