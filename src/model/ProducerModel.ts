import { Schema, model } from 'mongoose'

const ProducerModel = new Schema({
    name: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: false
    },
    region: {
        type: String,
        required: false
    }
})

export default model('Producer', ProducerModel)