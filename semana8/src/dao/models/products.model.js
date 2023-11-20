import mongoose from 'mongoose'

const collection = 'products'

const schema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    thumbnail: String,
    code: {
        type: String,
        unique: true
    },
    stock: Number
})

const productModel = mongoose.model(collection, schema)

export default productModel