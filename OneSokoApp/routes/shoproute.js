const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shopcontroller');

// Shop Routes
router.get('/', shopController.shops_list);
router.get('/:id', shopController.shop_detail);
router.post('/', shopController.shop_create);
router.put('/:id', shopController.shop_update);
router.delete('/:id', shopController.shop_delete);
router.post('/add-product', shopController.shop_add_product);
router.post('/remove-product', shopController.shop_remove_product);
router.get('/near', shopController.shops_near);
router.post('/products', shopController.shop_products);
router.post('/vendor', shopController.shop_vendor);

module.exports = router;