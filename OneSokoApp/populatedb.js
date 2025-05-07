const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import models
const { User } = require('./models/users');
const { Products } = require('./models/products');
const { Shop } = require('./models/shop');
const { Vendor } = require('./models/vendor');

async function populateDB() {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb://127.0.0.1/OneSoko', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Products.deleteMany({});
        await Shop.deleteMany({});
        await Vendor.deleteMany({});
        console.log('Cleared existing data');

        // Create products
        const product1 = new Products({
            _id: '68149d8d5f0ee548f2e8fa30',
            productName: 'Laptop',
            price: 999.99,
            description: 'High-performance laptop',
            stock: 10,
            status: 'Available',
            createdAt: new Date('2025-05-06T12:00:00Z')
        });
        await product1.save();
        console.log('Created product:', product1.productName);

        const product2 = new Products({
            _id: '68149d8d5f0ee548f2e8fa31',
            productName: 'Smartphone',
            price: 499.99,
            description: 'Latest smartphone model',
            stock: 15,
            status: 'Available',
            createdAt: new Date('2025-05-06T12:00:00Z')
        });
        await product2.save();
        console.log('Created product:', product2.productName);

        // Create a shop
        const shop = new Shop({
            _id: '68149d8d5f0ee548f2e8fa36',
            shopName: 'Tech Haven',
            description: 'Electronics and gadgets',
            location: {
                type: 'Point',
                coordinates: [-73.935242, 40.730610]
            },
            products: [product1._id, product2._id]
        });
        await shop.save();
        console.log('Created shop:', shop.shopName);

        // Create a vendor
        const vendor = new Vendor({
            _id: '68149d8d5f0ee548f2e8fa38',
            vendorName: 'John Doe',
            phoneNumber: 1234567890,
            email: 'john@example.com',
            shop: shop._id
        });
        await vendor.save();
        console.log('Created vendor:', vendor.vendorName);

        // Create a user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('test123', salt);
        const user = new User({
            _id: '68149d8d5f0ee548f2e8fa40',
            username: 'testuser',
            email: 'user@example.com',
            password: hashedPassword,
            role: 'customer',
            wishlist: [],
            cart: []
        });
        await user.save();
        console.log('Created user:', user.username);

        console.log('Database populated successfully');
    } catch (error) {
        console.error('Error populating database:', error);
    } finally {
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
    }
}

populateDB();