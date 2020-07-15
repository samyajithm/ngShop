const mongoose = require('mongoose');

const Store = require('../../models/inventory/stores');

/* function to format the response from db*/
const response = (result) => {
    return result.map(item => {
        return {
            _id: item.id,
            city: item.city,
            state: item.state,
            country: item.country
        }
    });
}

/* Controller to fetch all the stores*/
exports.STORES_GET_ALL = (req, res, next) => {

    Store.find()
    .exec()
    .then(result => {
        console.log("**Fetch all Stores***Success**");
        console.log(result);
        res.status(200).json({
            count: result.length,
            store: response(result)
        });
    })
    .catch(err => {
        console.log("**Fetch all Stores***Failure**");
        console.log(err)
        res.status(500).json({error: {errMsg: err.reason}});
     })
}

/* Controller to add a store*/
exports.STORES_ADD = (req, res, next) => {
    const store = new Store({
        _id: new mongoose.Types.ObjectId(),
        city: req.body.city,
        state: req.body.state,
        country: req.body.country
    })
    
    store
    .save()
    .then(result => {
        console.log("**Add Store***Success**");
        console.log(result);
        res.status(200).json({
            message: "Store added successfully",
            store: result
        });
    })
    .catch(err => {
            console.log("**Add Store***Failure**");
            console.log(err)
            res.status(500).json({error: {errMsg: err.reason}});
    })
}

/* Controller to remove a store
    Check if Id is valid or not
*/
exports.STORES_REMOVE = (req, res, next) => {
    const id = req.params.storeId;
    var valid = mongoose.Types.ObjectId.isValid(id);
    if(valid) {
        Store.findById(id)
        .then(result => {
            if(!result) {
                console.log("**Remove Store***Store not found***Failure**");
                console.log(result);
                return res.status(404).json({
                    error: {
                        errMsg:"Store not found"
                    }
                });
            } else{
                return Store.deleteOne({_id: id})
                .exec()
            }
        })
        .then(result => {
            if(result.n) {
                console.log("**Remove Store***Success**");
                res.status(200).json({
                    message: "Store removed successfully",
                    deletedCount: result.deletedCount,
                });
            } else {
                console.log("**Remove Store***Failure**");
                res.status(500).json({error: {errMsg: "Remove Store Failed"}});
            }
            console.log(result);
        })
        .catch(err => {
            console.log("**Remove Store***Failure**");
            console.log(err)
            res.status(500).json({error: {errMsg: err.reason}});
        })
    } else {
        console.log("**Remove Store***Store not found***Failure**");
        console.log(result);
        return res.status(404).json({
            error: {
                errMsg:"Store not found"
            }
        });
    }
}