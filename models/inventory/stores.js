const mongoose = require('mongoose');

const StoresSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    city: String,
    state: String,
    country: String
})

module.exports = mongoose.model('Stores', StoresSchema);