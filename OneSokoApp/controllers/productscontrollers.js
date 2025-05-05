// controls the product models 

const Product = require("../models/products");
const asyncHandler = require("express-async-handler");
const user = require("../models/users");
const shop = require("../models/shop");


// Display all the list of products
exports.product_list = asyncHandler(async(req, res, next) =>{
    const product = await Product.find().exec();
    res.status(200).json({
        message: "Products retrieved successfully",
        product
    });
})

exports.product_detail = asyncHandler(async(req, res, next) =>{
    const product = await Product.findById(req.params.id).exec();
    if(!product){
        return res.status(404).json({
            message: "Product not found"
        })
    }

    res.status(200).json({
        message:"Product retrieved successfully",
        product
    })
})

// Create a new product
exports.product_create = asyncHandler(async (req, res, next) => {
    const { productName, price, description, stock, status } = req.body;

    // Validate inputs
    if (!productName || !price || !description || !status) {
        return res.status(400).json({ message: "productName, price, description, and status are required" });
    }

    const product = new Product({
        productName,
        price,
        description,
        stock: stock || 0,
        status
    });

    await product.save();
    res.status(201).json({
        message: "Product created successfully",
        product
    });
});

// Update a product
exports.product_update = asyncHandler(async (req, res, next) => {
    const { productName, price, description, stock, status } = req.body;

    // Validate inputs
    if (!productName || !price || !description || !status) {
        return res.status(400).json({ message: "productName, price, description, and status are required" });
    }

    const product = await Product.findById(req.params.id).exec();
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    product.productName = productName;
    product.price = price;
    product.description = description;
    product.stock = stock || 0;
    product.status = status;

    await product.save();
    res.status(200).json({
        message: "Product updated successfully",
        product
    });
});

// Delete a product
exports.product_delete = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id).exec();
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    // Remove product from all users' wishlists and carts
    await user.updateMany(
        { $or: [{ wishlist: product._id }, { "cart.product": product._id }] },
        { $pull: { wishlist: product._id, cart: { product: product._id } } }
    );

    // Remove product from all shops' products array
    await Shop.updateMany(
        { products: product._id },
        { $pull: { products: product._id } }
    );

    await Product.deleteOne({ _id: req.params.id });
    res.status(200).json({
        message: "Product deleted successfully"
    });
});

// Add product to a shop
exports.product_add_to_shop = asyncHandler(async (req, res, next) => {
    const { productId, shopId } = req.body;

    // Validate inputs
    if (!productId || !shopId) {
        return res.status(400).json({ message: "productId and shopId are required" });
    }

    const product = await Product.findById(productId).exec();
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

// List products with name and price
exports.product_name_price = asyncHandler(async (req, res, next) => {
    const products = await Product.find({}, { productName: 1, price: 1, _id: 0 }).exec();
    res.status(200).json({
        message: "Products name and price retrieved successfully",
        products
    });
});

// List products with name and description
exports.product_name_descriptions = asyncHandler(async (req, res, next) => {
    const products = await Product.find({}, { productName: 1, description: 1, _id: 0 }).exec();
    res.status(200).json({
        message: "Products name and description retrieved successfully",
        products
    });
});

// List products with name, stock, and status
exports.product_name_stock_status = asyncHandler(async (req, res, next) => {
    const products = await Product.find({}, { productName: 1, stock: 1, status: 1, _id: 0 }).exec();
    res.status(200).json({
        message: "Products name, stock, and status retrieved successfully",
        products
    });
});
