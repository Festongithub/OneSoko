const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

// List all shops
exports.shops_list = asyncHandler(async (req, res, next) => {
    const Shop = mongoose.model("Shop");
    const shops = await Shop.find().populate('products').exec();
    res.status(200).json({
        message: "Shops retrieved successfully",
        shops
    });
});

// Get a single shop by ID
exports.shop_detail = asyncHandler(async (req, res, next) => {
    const Shop = mongoose.model("Shop");
    const shop = await Shop.findById(req.params.id).populate('products').exec();
    if (!shop) {
        return res.status(404).json({ message: "Shop not found" });
    }
    res.status(200).json({
        message: "Shop retrieved successfully",
        shop
    });
});

// Create a new shop
exports.shop_create = asyncHandler(async (req, res, next) => {
    const Shop = mongoose.model("Shop");
    const { shopName, description, location, products } = req.body;

    // Validate inputs
    if (!shopName || !description || !location || !location.type || !location.coordinates) {
        return res.status(400).json({ message: "shopName, description, and location (type, coordinates) are required" });
    }

    const shop = new Shop({
        shopName,
        description,
        location,
        products: products || []
    });

    await shop.save();
    res.status(201).json({
        message: "Shop created successfully",
        shop
    });
});

// Update a shop
exports.shop_update = asyncHandler(async (req, res, next) => {
    const Shop = mongoose.model("Shop");
    const { shopName, description, location, products } = req.body;

    // Validate inputs
    if (!shopName || !description || !location || !location.type || !location.coordinates) {
        return res.status(400).json({ message: "shopName, description, and location (type, coordinates) are required" });
    }

    const shop = await Shop.findById(req.params.id).exec();
    if (!shop) {
        return res.status(404).json({ message: "Shop not found" });
    }

    shop.shopName = shopName;
    shop.description = description;
    shop.location = location;
    shop.products = products || [];

    await shop.save();
    res.status(200).json({
        message: "Shop updated successfully",
        shop
    });
});

// Delete a shop
exports.shop_delete = asyncHandler(async (req, res, next) => {
    const Shop = mongoose.model("Shop");
    const Vendor = mongoose.model("Vendor");
    const shop = await Shop.findById(req.params.id).exec();
    if (!shop) {
        return res.status(404).json({ message: "Shop not found" });
    }

    // Remove shop reference from vendors
    await Vendor.updateMany(
        { shop: shop._id },
        { $unset: { shop: "" } }
    );

    await Shop.deleteOne({ _id: req.params.id });
    res.status(200).json({
        message: "Shop deleted successfully"
    });
});

// Add product to a shop
exports.shop_add_product = asyncHandler(async (req, res, next) => {
    const Shop = mongoose.model("Shop");
    const Products = mongoose.model("Products");
    const { shopId, productId } = req.body;

    // Validate inputs
    if (!shopId || !productId) {
        return res.status(400).json({ message: "shopId and productId are required" });
    }

    const shop = await Shop.findById(shopId).exec();
    if (!shop) {
        return res.status(404).json({ message: "Shop not found" });
    }

    const product = await Products.findById(productId).exec();
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    if (!shop.products.includes(productId)) {
        shop.products.push(productId);
        await shop.save();
    }

    const updatedShop = await Shop.findById(shopId).populate('products').exec();
    res.status(200).json({
        message: "Product added to shop",
        shop: updatedShop
    });
});

// Remove product from a shop
exports.shop_remove_product = asyncHandler(async (req, res, next) => {
    const Shop = mongoose.model("Shop");
    const { shopId, productId } = req.body;

    // Validate inputs
    if (!shopId || !productId) {
        return res.status(400).json({ message: "shopId and productId are required" });
    }

    const shop = await Shop.findById(shopId).exec();
    if (!shop) {
        return res.status(404).json({ message: "Shop not found" });
    }

    shop.products = shop.products.filter(id => id.toString() !== productId);
    await shop.save();

    const updatedShop = await Shop.findById(shopId).populate('products').exec();
    res.status(200).json({
        message: "Product removed from shop",
        shop: updatedShop
    });
});

// Find shops near a location
exports.shops_near = asyncHandler(async (req, res, next) => {
    const Shop = mongoose.model("Shop");
    const { lat, lng, maxDistance = 10000 } = req.query;

    // Validate inputs
    if (!lat || !lng) {
        return res.status(400).json({ message: "lat and lng are required" });
    }

    const shops = await Shop.find({
        location: {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [parseFloat(lng), parseFloat(lat)]
                },
                $maxDistance: parseInt(maxDistance)
            }
        }
    }).populate('products').exec();

    res.status(200).json({
        message: "Shops near location retrieved successfully",
        shops
    });
});

// List products in a shop by vendor
exports.shop_products = asyncHandler(async (req, res, next) => {
    const Shop = mongoose.model("Shop");
    const Vendor = mongoose.model("Vendor");
    const { vendorId } = req.body;

    // Validate inputs
    if (!vendorId) {
        return res.status(400).json({ message: "vendorId is required" });
    }

    // Find the vendor
    const vendor = await Vendor.findById(vendorId).exec();
    if (!vendor) {
        return res.status(404).json({ message: "Vendor not found" });
    }

    // Check if vendor owns a shop
    if (!vendor.shop) {
        return res.status(404).json({ message: "Vendor does not own a shop" });
    }

    // Find the shop and populate products
    const shop = await Shop.findById(vendor.shop).populate('products').exec();
    if (!shop) {
        return res.status(404).json({ message: "Shop not found" });
    }

    res.status(200).json({
        message: "Products in shop retrieved successfully",
        shopName: shop.shopName,
        products: shop.products
    });
});

// List vendor and shop owned
exports.shop_vendor = asyncHandler(async (req, res, next) => {
    const Vendor = mongoose.model("Vendor");
    const { vendorId } = req.body;

    // Validate inputs
    if (!vendorId) {
        return res.status(400).json({ message: "vendorId is required" });
    }

    // Find the vendor and populate shop
    const vendor = await Vendor.findById(vendorId).populate({
        path: 'shop',
        populate: { path: 'products' }
    }).exec();
    if (!vendor) {
        return res.status(404).json({ message: "Vendor not found" });
    }

    res.status(200).json({
        message: "Vendor and shop retrieved successfully",
        vendor: {
            _id: vendor._id,
            vendorName: vendor.vendorName,
            phoneNumber: vendor.phoneNumber,
            email: vendor.email,
            shop: vendor.shop || null
        }
    });
});