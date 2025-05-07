const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

// List all products
exports.products_list = asyncHandler(async (req, res, next) => {
    const Products = mongoose.model("Products");
    const products = await Products.find().exec();
    res.status(200).json({
        message: "Products retrieved successfully",
        products
    });
});

// Get a single product by ID
exports.product_detail = asyncHandler(async (req, res, next) => {
    const Products = mongoose.model("Products");
    const product = await Products.findById(req.params.id).exec();
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({
        message: "Product retrieved successfully",
        product
    });
});

// Create a new product
exports.product_create = asyncHandler(async (req, res, next) => {
    const Products = mongoose.model("Products");
    const { productName, price, description, stock, status } = req.body;

    // Validate inputs
    if (!productName || !price || !stock) {
        return res.status(400).json({ message: "productName, price, and stock are required" });
    }

    const product = new Products({
        productName,
        price,
        description: description || "",
        stock,
        status: status || "Available"
    });

    await product.save();
    res.status(201).json({
        message: "Product created successfully",
        product
    });
});

// Update a product
exports.product_update = asyncHandler(async (req, res, next) => {
    const Products = mongoose.model("Products");
    const { productName, price, description, stock, status } = req.body;

    // Validate inputs
    if (!productName || !price || !stock) {
        return res.status(400).json({ message: "productName, price, and stock are required" });
    }

    const product = await Products.findById(req.params.id).exec();
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    product.productName = productName;
    product.price = price;
    product.description = description || "";
    product.stock = stock;
    product.status = status || "Available";

    await product.save();
    res.status(200).json({
        message: "Product updated successfully",
        product
    });
});

// Delete a product
exports.product_delete = asyncHandler(async (req, res, next) => {
    const Products = mongoose.model("Products");
    const Shop = mongoose.model("Shop");
    const product = await Products.findById(req.params.id).exec();
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    // Remove product from shops
    await Shop.updateMany(
        { products: product._id },
        { $pull: { products: product._id } }
    );

    await Products.deleteOne({ _id: req.params.id });
    res.status(200).json({
        message: "Product deleted successfully"
    });
});

// Add product to a shop
exports.product_add_to_shop = asyncHandler(async (req, res, next) => {
    const Products = mongoose.model("Products");
    const Shop = mongoose.model("Shop");
    const { productId, shopId } = req.body;

    // Validate inputs
    if (!productId || !shopId) {
        return res.status(400).json({ message: "productId and shopId are required" });
    }

    const product = await Products.findById(productId).exec();
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    const shop = await Shop.findById(shopId).exec();
    if (!shop) {
        return res.status(404).json({ message: "Shop not found" });
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

// Get product name and price
exports.product_name_price = asyncHandler(async (req, res, next) => {
    const Products = mongoose.model("Products");
    const products = await Products.find().select('productName price').exec();
    res.status(200).json({
        message: "Product names and prices retrieved successfully",
        products
    });
});

// Get product name and descriptions
exports.product_name_descriptions = asyncHandler(async (req, res, next) => {
    const Products = mongoose.model("Products");
    const products = await Products.find().select('productName description').exec();
    res.status(200).json({
        message: "Product names and descriptions retrieved successfully",
        products
    });
});

// Get product name and stock status
exports.product_name_stock_status = asyncHandler(async (req, res, next) => {
    const Products = mongoose.model("Products");
    const products = await Products.find().select('productName stock status').exec();
    res.status(200).json({
        message: "Product names and stock status retrieved successfully",
        products
    });
});