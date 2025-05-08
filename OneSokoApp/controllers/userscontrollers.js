const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
// const validator = require('validator');

// Register a new user
const user_register = asyncHandler(async (req, res, next) => {
    const User = require('../models/users'); 
    console.log('req.body:', req.body);
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    const userExists = await User.findOne({ email }).exec();
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }


    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
        username,
        email,
        password: hashedPassword,
        role: role || 'customer', // Default to customer
        wishlist: [],
        cart: []
    });
    await user.save();

    const token = generateToken(user._id, user.role);
    res.status(201).json({
        message: 'User registered successfully',
        user: { _id: user._id, username, email, role },
        token
    });
});

// Login a user
const user_login = asyncHandler(async (req, res, next) => {
    const User = mongoose.model('User');
    console.log('req.body:', req.body);
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email }).exec();
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id, user.role);
    res.status(200).json({
        message: 'User logged in successfully',
        user: { _id: user._id, username: user.username, email, role: user.role },
        token
    });
});

// Generate JWT
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET || 'your_jwt_secret', {
        expiresIn: '30d'
    });
};

// In userscontrollers.js, add after existing exports
// Add product to wishlist
const users_wishlist_add = asyncHandler(async (req, res, next) => {
    const User = mongoose.model('User');
    const Products = mongoose.model('Products');
    console.log('req.body:', req.body);
    const { productId } = req.body;

    if (!productId) {
        return res.status(400).json({ message: 'productId is required' });
    }

    const product = await Products.findById(productId).exec();
    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    const user = await User.findById(req.user._id).exec();
    if (user.wishlist.includes(productId)) {
        return res.status(400).json({ message: 'Product already in wishlist' });
    }

    user.wishlist.push(productId);
    await user.save();
    const populatedUser = await User.findById(req.user._id).populate('wishlist').exec();
    res.status(200).json({
        message: 'Product added to wishlist',
        wishlist: populatedUser.wishlist
    });
});

// Get user's wishlist
const users_wishlist_get = asyncHandler(async (req, res, next) => {
    const User = mongoose.model("User");
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
const user_remove_wishlist = asyncHandler(async (req, res, next) => {
    const User = mongoose.model('User');
    console.log('req.body:', req.body);
    const { productId } = req.body;

    if (!productId) {
        return res.status(400).json({ message: 'productId is required' });
    }

    const user = await User.findById(req.user._id).exec();
    user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
    await user.save();
    const populatedUser = await User.findById(req.user._id).populate('wishlist').exec();
    res.status(200).json({
        message: 'Product removed from wishlist',
        wishlist: populatedUser.wishlist
    });
});

// Add product to cart
const user_add_cart = asyncHandler(async (req, res, next) => {
    const User = mongoose.model('User');
    const Products = mongoose.model('Products');
    console.log('req.body:', req.body);
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
        return res.status(400).json({ message: 'productId and quantity are required' });
    }

    const product = await Products.findById(productId).exec();
    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    const user = await User.findById(req.user._id).exec();
    user.cart.push({ product: productId, quantity });
    await user.save();
    const populatedUser = await User.findById(req.user._id).populate('cart.product').exec();
    res.status(200).json({
        message: 'Product added to cart',
        cart: populatedUser.cart
    });
});

// Remove product from cart
const user_remove_cart = asyncHandler(async (req, res, next) => {
    const User = mongoose.model('User');
    console.log('req.body:', req.body);
    const { productId } = req.body;

    if (!productId) {
        return res.status(400).json({ message: 'productId is required' });
    }

    const user = await User.findById(req.user._id).exec();
    user.cart = user.cart.filter(item => item.product.toString() !== productId);
    await user.save();
    const populatedUser = await User.findById(req.user._id).populate('cart.product').exec();
    res.status(200).json({
        message: 'Product removed from cart',
        cart: populatedUser.cart
    });
});

// Get user's cart
const users_cart_get = asyncHandler(async (req, res, next) => {
    const User = mongoose.model("User");
    const user = await User.findById(req.params.id).populate('cart.productId').exec();
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
        message: "Cart retrieved successfully",
        cart: user.cart
    });
});

module.exports = {user_register, user_login, users_wishlist_add,
    users_wishlist_get, user_remove_wishlist, 
    user_remove_cart, user_add_cart, 
    users_cart_get }