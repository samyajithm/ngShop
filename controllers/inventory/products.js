const mongoose = require('mongoose');
const Product = require('../../models/inventory/products');

/* function to format the response from db*/
const response = (result) => {
    return result.map(item => {
        return {
            _id: item.id,
            name: item.name,
            description: item.description,
            price: item.price,
            quantity: item.quantity,
            storeId: item.storeId,
            createdTime: item.createdTime,
            lastModified: item.lastModified
        }
    })
}

/* Controller to fetch all the Products*/
exports.PRODUCTS_GET_ALL = (req, res, next) => {
    Product.find()
    .populate('Stores')
    .exec()
    .then(result => {
        console.log("**Fetch all Products***Success**");
        console.log(result);
        res.status(200).json({
            count: result.length,
            products: response(result)
        });
    })
    .catch(err => {
        console.log("**Fetch all Products***Failure**");
        console.log(err)
        res.status(500).json({error: {errMsg: err.reason}});
    })
}

/* Controller to add Product*/
exports.PRODUCTS_CREATE = (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        quantity: req.body.quantity,
        description: req.body.description,
        storeId: req.body.storeId,
    })
    product
    .save()
    .then(result => {
        console.log("**Add Products***Success**");
        console.log(result);
        res.status(200).json({
            message: "Product added successfully",
            product: result
        });
    })
    .catch(err => {
        console.log("**Add Products***Failure**");
        console.log(err)
        res.status(500).json({error: {errMsg: err.reason}});
    })
}

/* Controller to fetch specific Product*/
exports.PRODUCTS_GET_ONE = (req, res, next) => {
    const id = req.params.productId;
    var valid = mongoose.Types.ObjectId.isValid(id);
    if(valid) {
        Product.findById(id)
        .populate('Stores', 'city state country _id')
        .exec()
        .then(result => {
            console.log("**Fetch Product***Success**");
            console.log(result);
            if(result){
                res.status(200).json({
                    product: result
                });
            } else {
                console.log("**Fetch Product***Product not found***Failure**");
                res.status(404).json({
                    error: {
                        errorMsg:"Product not found"
                    }
                })
            }
        })
        .catch(err => {
            console.log("**Fetch Product***Failure**");
            console.log(err)
            res.status(500).json({error: {errMsg: err.reason}});
        })
    } else {
        console.log("**Fetch Product***Product not found***Failure**");
        res.status(404).json({
            error: {
                errorMsg:"Product not found"
            }
        })
    }
}

/* Controller to delete specific product
    Check if the Id is valid
    Execute Delete only if product exist
*/
exports.PRODUCTS_DELETE = (req, res, next) => {
    const id = req.params.productId;
    var valid = mongoose.Types.ObjectId.isValid(id);
    if(valid) {
        Product.findById(id)
        .then(result => {
            console.log(result);
            if(!result) {
                console.log("**Delete Product***Product not found***Failure**");
                return res.status(404).json({
                    error: {
                        errMsg:"Product not found"
                    }
                });
            } else{
                return Product.deleteOne({_id: id})
                .exec()
            }
        })
        .then(result => {
            if(result.n) {
                console.log("**Delete Product***Success**");
                res.status(200).json({message: "Product deleted successfully", deletedCount: result.deletedCount});
            } else {
                console.log("**Delete Product***Failure**");
                res.status(200).json({message: "Product delete failed", result: result});
            }
            console.log(result);
        })
        .catch(err => {
            console.log("**Delete Product***Failure**");
            console.log(err)
            res.status(500).json({error: {errMsg: err.reason}});
        })
    } else {
        console.log("**Delete Product***Product not found***Failure**");
        return res.status(404).json({
            error: {
                errorMsg:"Product not found"
            }
        })
    }
}

/* Controller to update specific product
    Check if Id is valid
    Execute update only if product exists
*/
exports.PRODUCTS_UPDATE =  (req, res, next) => {
    const id = req.params.productId;
    var valid = mongoose.Types.ObjectId.isValid(id);
    if(valid) {
        Product.findById(id)
        .then(result => {
            console.log(result);
            if(!result) {
                console.log("**Update Product***Product not found***Failure**");
                return res.status(404).json({
                    error: {
                        errMsg:"Product not found"
                    }
                });
            } else {
                const updateObj = {};
                for(const key of Object.keys(req.body)) {
                    updateObj[key] = req.body[key];
                }
                return Product.updateOne({ _id: id }, { $set: updateObj })
                .exec()
            }
        })
        .then(result => {
            console.log(result);
            if(result.n){
                console.log("**Update Product***Success**");
                res.status(200).json({message: "Product updated successfully"})
            } else {
                console.log("**Update Product***Failure**");
                res.status(500).json({message: "Product updated failed"})
            }
            console.log(result);
        })
        .catch(err => {
            console.log("**Update Product***Failure**");
            console.log(err)
            res.status(500).json({error: {errMsg: err.reason}});
        })
    } else {
        console.log("**Update Product***Product not found***Failure**");
        res.status(404).json({
            error: {
                errorMsg:"Product not found"
            }
        })
    }
}
