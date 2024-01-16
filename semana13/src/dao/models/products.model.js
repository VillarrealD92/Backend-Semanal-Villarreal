import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const collection = 'products'

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique:true
    },
    price: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    thumbnail: {
        type: Array
    }
})

schema.plugin(mongoosePaginate)

const productModel = mongoose.model(collection, schema)

export default productModel