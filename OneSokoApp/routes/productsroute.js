const express = require('express');
const router = express.Router();
const productController = require('../controllers/productcontroller');

// Product Routes
router.get('/', productController.products_list);
router.get('/:id', productController.product_detail);
router.post('/', productController.product_create);
router.put('/:id', productController.product_update);
router.delete('/:id', productController.product_delete);
router.post('/add-to-shop', productController.product_add_to_shop);
router.get('/name-price', productController.product_name_price);
router.get('/name-descriptions', productController.product_name_descriptions);
router.get('/name-stock-status', productController.product_name_stock_status);

module.exports = router;