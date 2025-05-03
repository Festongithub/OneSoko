const mongoose = require('mongoose');

// Users Schema
const UsersSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        maxLength: 10,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        maxLength: 10,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    cart: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
            default: 1
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

UsersSchema.virtual("name").get(function() {
    let fullname = "";
    if (this.username && this.email) {
        fullname = `${this.username}, ${this.email}`;
    }
    return fullname;
});

UsersSchema.virtual("url").get(function() {
    return `/OneSoko/user/${this._id}`;
});

// Shop Schema
const ShopSchema = new mongoose.Schema({
    shopName: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

ShopSchema.virtual("name").get(function() {
    let shopFullName = "";
    if (this.shopName && this.location) {
        shopFullName = `${this.shopName}, ${this.location.type}`;
    }
    return shopFullName;
});

ShopSchema.index({ location: "2dsphere" });
ShopSchema.index({ shopName: 1 });

// Product Schema
const ProductSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    status: {
        type: String,
        required: true,
        enum: ["Available", "Restocked", "Unavailable"],
        default: "Available"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

ProductSchema.virtual("name").get(function() {
    let fullname = "";
    if (this.productName && this.price) {
        fullname = `${this.productName}, ${this.price}`;
    }
    return fullname;
});

ProductSchema.virtual("stockInfo").get(function() {
    let fullStock = "";
    if (this.stock && this.productName) {
        fullStock = `${this.stock}, ${this.productName}`;
    }
    return fullStock;
});

// Vendor Schema
const VendorSchema = new mongoose.Schema({
    vendorName: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    phoneNumber: {
        type: Number,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop'
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

VendorSchema.virtual("Details").get(function() {
    let VendorDetails = "";
    if (this.vendorName && this.phoneNumber) {
        VendorDetails = `${this.vendorName}, ${this.phoneNumber}`;
    }
    return VendorDetails;
});

// Create Models
const User = mongoose.model('User', UsersSchema);
const Shop = mongoose.model('Shop', ShopSchema);
const Product = mongoose.model('Product', ProductSchema);
const Vendor = mongoose.model('Vendor', VendorSchema);

// Sample Data Population
async function populateDB() {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb://localhost:27017/OneSokoDb', {});
        console.log('Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Shop.deleteMany({});
        await Product.deleteMany({});
        await Vendor.deleteMany({});
        console.log('Cleared existing data');

        // Create Products
        const products = await Product.create([
            {
                productName: 'Laptop',
                price: 999.99,
                description: 'High-performance laptop',
                stock: 10,
                status: 'Available'
            },
            {
                productName: 'Smartphone',
                price: 499.99,
                description: 'Latest model smartphone',
                stock: 20,
                status: 'Available'
            },
            {
                productName: 'Headphones',
                price: 79.99,
                description: 'Wireless headphones',
                stock: 15,
                status: 'Restocked'
            }
        ]);
        console.log('Created products');

        // Create Shops
        const shops = await Shop.create([
            {
                shopName: 'Tech Haven',
                description: 'Electronics and gadgets',
                products: [products[0]._id, products[1]._id],
                location: {
                    type: 'Point',
                    coordinates: [-73.935242, 40.730610]
                }
            },
            {
                shopName: 'Gadget Zone',
                description: 'Latest tech accessories',
                products: [products[1]._id, products[2]._id],
                location: {
                    type: 'Point',
                    coordinates: [-73.955242, 40.740610]
                }
            }
        ]);
        console.log('Created shops');

        // Create Vendors
        const vendors = await Vendor.create([
            {
                vendorName: 'John Doe',
                phoneNumber: 1234567890,
                email: 'john@example.com',
                shop: shops[0]._id
            },
            {
                vendorName: 'Jane Smith',
                phoneNumber: 9087654321,
                email: 'jane@example.com',
                shop: shops[1]._id
            }
        ]);
        console.log('Created vendors');

        // Create Users
        await User.create([
            {
                username: 'alice',
                email: 'alice.com',
                password: 'password123',
                wishlist: [products[0]._id, products[2]._id],
                cart: [
                    { product: products[0]._id, quantity: 1 },
                    { product: products[1]._id, quantity: 2 }
                ]
            },
            {
                username: 'bob',
                email: 'bob@ex.com',
                password: 'password456',
                wishlist: [products[1]._id],
                cart: [
                    { product: products[2]._id, quantity: 3 }
                ]
            }
        ]);
        console.log('Created users');

        console.log('Database populated successfully');
    } catch (error) {
        console.error('Error populating database:', error);
    } finally {
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
    }
}

// Run the population script
populateDB();