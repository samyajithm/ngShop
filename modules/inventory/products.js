const express = require('express');
const router = express.Router();

const productController = require('../../controllers/inventory/products');

/* API to fetch all the products*/
router.get('/', productController.PRODUCTS_GET_ALL);

/* API to create/add new products*/
router.post('/', productController.PRODUCTS_CREATE);

/* API to get specific product*/
router.get('/:productId', productController.PRODUCTS_GET_ONE);

/* API to delete product*/
router.delete("/:productId", productController.PRODUCTS_DELETE);

/* API to update product*/
router.patch("/:productId", productController.PRODUCTS_UPDATE)

module.exports = router