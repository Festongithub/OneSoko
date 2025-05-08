const express = require('express');
const router = express.Router();
const userController = require('../controllers/userscontrollers');

// User Routes
router.post('/register', userController.user_register);
router.post('/login', userController.user_login);

router.post('/wishlist/add', userController.users_wishlist_add);
router.post('/wishlist/remove', userController.user_remove_wishlist);
router.get('/wishlist/:id', userController.users_wishlist_get);
router.post('/cart/add', userController.user_add_cart);
router.post('/cart/remove', userController.user_remove_cart);
router.get('/cart/:id', userController.users_cart_get);

module.exports = router;