import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"

const collectionName = 'carts';

const cartSchema = new mongoose.Schema({
    products: {
        type:[
            {
                product:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:'products',
                },
                quantity:{
                    type:Number
                }
            },
        ],
    }
});

cartSchema.pre('findOne', function(){
    this.populate('products.product');
})

const cartsModel = mongoose.model(collectionName, cartSchema);

export default cartsModel