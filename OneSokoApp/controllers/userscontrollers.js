const Product  = require("../models/products");
const user = require("../models/users");
const asyncHandler = require("express-async-handler");

// Display list of all users.

exports.users_list = asyncHandler(async(req, res, next) => {
    res.send("NOT Implemented : Users List");
});

// handle user creation
exports.users_create_get = asyncHandler(async(req, res, next) => {
    res.send("NOT implemented : User Create GET");
});

// handle user deletion
exports.users_delete_get = asyncHandler(async(req, res, next) =>{
    res.send("NOT Implemented: User delete GEt")
});

// Handle user update on POST
exports.users_update_post = asyncHandler(async(req, res, next) =>{
    res.send("NOT implemented; User update  POST");
});

exports.users_wishlist_add = asyncHandler(async(req, res, ) => {
    const {userId, productId} = req.body;

    if(!userId || productId){
        return res.status(400).json({
            message: "userId and ProductId are required"
        });
    }
    // check if user exists
    const user = await user.findById(userId);
    if(!user){
        res.status(400).json({
            message: "User not found"
        });
    }

    // check if the products exixts
    const product = await Product.findById(productId);
    if(!product){
        res.status(400).json({
            message: "product not found"
        });
    }

    // Populate wishlist for response
    if(!user.wishlist.includes(productId)){
        user.wishlist.push(productId);
        await user.save();
    };

    const updateUser = await user.findById(userId).populate("wishlist");
    res.status(200).json({
        message: "Product added to wishlist",
        user: updateUser
    });
});

// Get user's wishlist
exports.users_wishlist_get = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id).populate('wishlist').exec();
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
        message: "Wishlist retrieved successfully",
        wishlist: user.wishlist
    });
});


// Remove product from wishlist

exports.users_wishlist_remove = asyncHandler(async(req, res, next) => {
    const {userId, productId} = req.body;

    if(!userId || productId){
        return res.status(400).json({
            message: "userId and productId required"
        });
    }
    const user = await user.findById(userId);
    if(!user){
        res.status(400).json({
            message: "User not found"
        });
    }

    // Remove product from wishlist
    user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
    await user.save();

    // Response for wishlist population
    const updateUser = await user.findById(userId).populate("wishlist");
    res.status(200).json({
        message: "Product added to wishlist",
        user : updateUser
    });
})

// Add product to cart
exports.users_cart_add = asyncHandler(async (req, res, next) => {
    const { userId, productId, quantity = 1 } = req.body;

    // Validate inputs
    if (!userId || !productId) {
        return res.status(400).json({ message: "userId and productId are required" });
    }
    if (quantity < 1) {
        return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    // Check if product is already in cart
    const cartItem = user.cart.find(item => item.product.toString() === productId);
    if (cartItem) {
        cartItem.quantity += quantity;
    } else {
        user.cart.push({ product: productId, quantity });
    }

    await user.save();

    // Populate cart for response
    const updatedUser = await User.findById(userId).populate('cart.product');
    res.status(200).json({
        message: "Product added to cart",
        user: updatedUser
    });
});

// Get user's cart
exports.users_cart_get = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id).populate('cart.product').exec();
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
        message: "Cart retrieved successfully",
        cart: user.cart
    });
});

// Remove product from cart
exports.users_cart_remove = asyncHandler(async (req, res, next) => {
    const { userId, productId } = req.body;

    // Validate inputs
    if (!userId || !productId) {
        return res.status(400).json({ message: "userId and productId are required" });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // Remove product from cart
    user.cart = user.cart.filter(item => item.product.toString() !== productId);
    await user.save();

    // Populate cart for response
    const updatedUser = await User.findById(userId).populate('cart.product');
    res.status(200).json({
        message: "Product removed from cart",
        user: updatedUser
    });
});


