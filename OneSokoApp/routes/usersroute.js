const express = require('express');
const router = express.Router();
const userController = require('../controllers/userscontrollers');

// User Routes
router.post('/wishlist/add', userController.users_wishlist_add);
router.post('/wishlist/remove', userController.users_wishlist_remove);
router.get('/wishlist/:id', userController.users_wishlist_get);
router.post('/cart/add', userController.users_cart_add);
router.post('/cart/remove', userController.users_cart_remove);
router.get('/cart/:id', userController.users_cart_get);

module.exports = router;