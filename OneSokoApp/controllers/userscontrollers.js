const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// Register a new user
exports.user_register = asyncHandler(async (req, res, next) => {
    const User = mongoose.model('User');
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
exports.user_login = asyncHandler(async (req, res, next) => {
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

module.exports = {
    user_register,
    user_login
};