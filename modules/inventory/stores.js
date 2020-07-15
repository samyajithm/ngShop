const express = require('express');
const router = express.Router();

const storeController = require('../../controllers/inventory/stores');

/* API to fetch all the stores*/
router.get('/', storeController.STORES_GET_ALL);

/* API to add new store*/
router.post('/', storeController.STORES_ADD);

/* API to delete store*/
router.delete("/:storeId", storeController.STORES_REMOVE);

module.exports = router