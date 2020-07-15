const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true},
    quantity: {type: Number, required: true},
    storeId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Stores"
    },
    createdTime: {
        type: Date,
        default: new Date()
    },
    lastModified: {
        type: Date,
        default: new Date()
    }
})

module.exports = mongoose.model('Products', productSchema);