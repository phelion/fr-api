import { Schema, Types, model } from 'mongoose'

const ProductModel = new Schema({
    name: {
        type: String,
        required: true
    },
    vintage: {
        type: String,
        required: true
    },
    producerId: {
        type: Types.ObjectId,
        required: true
    },
    producer: {
        type: Types.ObjectId,
        ref: 'Producer',
    }
})

export default model('Product', ProductModel)