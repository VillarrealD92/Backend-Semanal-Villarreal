export default class CartServices {

    constructor(dao){
        this.dao= dao
    }
    
    getCarts = async () => {return this.dao.getCarts()}
    createCart = async (userid) => {return this.dao.createCart(userid)}
    getCartById = async id => {return this.dao.getCartById(id)}
    addProductCart = async (cid, pid) => {return this.dao.addProductCart(cid,pid)}
    deletProductCart = async (cid, pid) => {return this.dao.deletProductCart(cid,pid)}
    overwriteCart= async (cid, newProds) => {return this.dao.overwriteCart(cid, newProds)}
    uptadeQuantity= async (cid,pid,newQuantity) => {return this.dao.uptadeQuantity(cid, pid, newQuantity)}
    deletCart= async cid => {return this.dao.deletCart(cid)}
    }