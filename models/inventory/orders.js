const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products',
        required: true
    },
    quantity: {
        type: Number,
        default: 1
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

module.exports = mongoose.model('Orders', OrderSchema);