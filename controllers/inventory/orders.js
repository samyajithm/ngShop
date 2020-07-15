const mongoose = require('mongoose');
const Order = require('../../models/inventory/orders');
const Product = require('../../models/inventory/products');

/* function to format the response from db*/
const response = (result) => {
    return result.map(item => {
        return {
            _id: item.id,
            productId: item.productId,
            quantity: item.quantity,
            createdTime: item.createdTime,
            lastModified: item.lastModified
        }
    });
}

/* Controller to fetch all the orders*/
exports.ORDERS_GET_ALL = (req, res, next) => {

    Order.find()
    .populate('Products', 'name _id')
    .exec()
    .then(result => {
        console.log("**Fetch all Orders***Success**");
        console.log(result);
        res.status(200).json({
            count: result.length,
            order: response(result)
        });
    })
    .catch(err => {
        console.log("**Fetch all Orders***Failure**")
        console.log(err)
        res.status(500).json({error: {errMsg: err.reason}});
     })
}

/* Controller to create new orders
    checks whether the 'productId' is valid and if it exists
    then will vallidate the order quantity with available quantity
    
    Once order created, product quantity is reduced by order quantity
*/
exports.ORDERS_CREATE = (req, res, next) => {
    const id = req.body.productId
    let productQuantity;
    var valid = mongoose.Types.ObjectId.isValid(id);
    if(valid) {
        Product.findById(id)
        .then(result => {
            if(!result) {
                console.log("**Create Order***Product not found***Failure**")
                return res.status(404).json({
                    error: {
                        errMsg:"Product not found"
                    }
                });
            } else{
                if(result && result.quantity < req.body.quantity) {
                    console.log("**Create Order***Insufficient quantity***Failure**")
                    return res.status(404).json({
                        error: {
                            errMsg:"Insufficient quantity"
                        }
                    });
                } else {
                    const order = new Order({
                        _id: new mongoose.Types.ObjectId(),
                        quantity: req.body.quantity,
                        productId: req.body.productId
                    })
                    productQuantity = result.quantity;
                    return order
                        .save()
                }
            }
        })
        .then(result => {
            console.log("**Create Order***Success**");
            console.log(result);
            res.status(200).json({
                message: "Order created successfully",
                order: result
            });
            // Update the product with remaining quantity
            return Product.updateOne({
                _id: id
            }, {
                $set: {
                    quantity: productQuantity - req.body.quantity
                }
            })
            .exec()
         })
         .then(result => {
            console.log("**Create Order***Product Quantity update***Success**")
            console.log(result);
        })
        .catch(err => {
            console.log("**Create Order***Failure**");
            console.log(err);
            res.status(500).json({error: {errMsg: err.reason}});
        })
    } else {
        console.log("**Create Order***Invalid Product Id***Failure**");
        return res.status(404).json({
            error: {
                errMsg:"Invalid product Id"
            }
        });
    }
}

/* Controller to fetch specific Order*/
exports.ORDERS_GET_ONE = (req, res, next) => {
    const id = req.params.orderId;
    var valid = mongoose.Types.ObjectId.isValid(id);
    if(valid) {
        Order.findById(id)
        .populate('product', 'name _id')
        .exec()
        .then(result => {
            console.log(result);
            if(result){
                console.log("**Fetch Order***Success**");
                console.log(result);
                res.status(200).json({
                    order: result
                });
            } else {
                console.log("**Fetch Order***Invalid Order***Failure**");
                res.status(404).json({
                    error: {
                        errorMsg:"Invalid Order"
                    }
                })
            }
        })
        .catch(err => {
            console.log("**Fetch Order***Failure**");
            console.log(err)
            res.status(500).json({error: {errMsg: err.reason}});
        })
    } else {
        console.log("**Fetch Order***Invalid Order Id***Failure**");
        res.status(404).json({
            error: {
                errorMsg:"Invalid Order Id"
            }
        })
    }
}

/* Controller to cancel the orders
    checks whether the 'oorderId' is valid and if it exists
    
    Once order is cancelled, product quantity is updated by adding order quantity
*/
exports.ORDERS_CANCEL = (req, res, next) => {
    const id = req.params.orderId;
    var valid = mongoose.Types.ObjectId.isValid(id);
    let orderQuantity;
    let productId;
    if(valid) {
        Order.findById(id)
        .then(result => {
            console.log(result);
            if(!result) {
                console.log("**Cancel Order***Order not found***Failure**");
                return res.status(404).json({
                    error: {
                        errMsg:"Order not found"
                    }
                });
            } else{
                orderQuantity = result.quantity;
                productId = result.productId;
                return Order.deleteOne({_id: id})
                .exec()
            }
        })
        .then(result => {
            if(result.n) {
                console.log("**Cancel Order***Success**");

                res.status(200).json({message: "Order cancelled successfully", deletedCount: result.deletedCount});

                //  Fetch the poduct in the order and update quantity by adding it to quantity in the order 
                return Product.findById(productId)
                    .then(result => {
                        return Product.updateOne({
                            _id: productId
                        }, {
                            $set: {
                                quantity: result.quantity + orderQuantity
                            }
                        })
                        .exec()
                    })
            } else {
                console.log("**Cancel Order***Failure**");
                res.status(200).json({message: "Order cancel failed", result: result});
            }
            console.log(result);
        })
        .then(result => {
            console.log(result);
        })
        .catch(err => {
            console.log("**Cancel Order***Failure**");
            console.log(err)
            res.status(500).json({error: {errMsg: err.reason}});
        })
    } else {
        console.log("**Cancel Order***Invalid Order Id***Failure**");
        res.status(404).json({
            error: {
                errorMsg:"Invalid Order Id"
            }
        })
    }
}

/* exports.ORDERS_UPDATE = (req, res, next) => {
    const id = req.params.OrderId;
    var valid = mongoose.Types.ObjectId.isValid(id);
    if(valid) {
        const updateObj = {};
        for(const key of Object.keys(req.body)) {
            updateObj[key] = req.body[key];
        }
        Order.updateOne({
            _id: id
        }, {
            $set: updateObj
        })
        .exec()
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).json({error: {errMsg: err.reason}});
        })
    } else {
        res.status(404).json({
            error: {
                errorMsg:"Invalid Order"
            }
        })
    }
}*/