const express = require('express');
const router = express.Router();

const orderController = require('../../controllers/inventory/orders');

/* API to fetch all the orders 
* return count and list of orders
*/
router.get('/', orderController.ORDERS_GET_ALL);

/* API to create Orders*/
router.post('/', orderController.ORDERS_CREATE);

/* API to get specific order by passing orderId*/
router.get('/:orderId', orderController.ORDERS_GET_ONE);

/* API to cancel specific order*/
router.delete("/:orderId", orderController.ORDERS_CANCEL);

// router.patch("/:orderId", orderController.ORDERS_UPDATE)

module.exports = router