const asyncHandler = require("express-async-handler");
const { Shop } = require("../models/shop");

// Clear module cache for vendor.js
delete require.cache[require.resolve("../models/vendor")];

// List all vendors
exports.vendors_list = asyncHandler(async (req, res, next) => {
    const { Vendor } = require("../models/vendor");
    console.log('Vendor:', Vendor); // Debug log
    if (!Vendor) {
        throw new Error('Vendor model is undefined');
    }
    const vendors = await Vendor.find().populate('shop').exec();
    res.status(200).json({
        message: "Vendors retrieved successfully",
        vendors
    });
});

// Get a single vendor by ID
exports.vendor_detail = asyncHandler(async (req, res, next) => {
    const { Vendor } = require("../models/vendor");
    const vendor = await Vendor.findById(req.params.id).populate('shop').exec();
    if (!vendor) {
        return res.status(404).json({ message: "Vendor not found" });
    }
    res.status(200).json({
        message: "Vendor retrieved successfully",
        vendor
    });
});

// Create a new vendor
exports.vendor_create = asyncHandler(async (req, res, next) => {
    const { Vendor } = require("../models/vendor");
    const { vendorName, phoneNumber, email } = req.body;

    // Validate inputs
    if (!vendorName || !phoneNumber || !email) {
        return res.status(400).json({ message: "vendorName, phoneNumber, and email are required" });
    }

    const vendor = new Vendor({
        vendorName,
        phoneNumber,
        email
    });

    await vendor.save();
    res.status(201).json({
        message: "Vendor created successfully",
        vendor
    });
});

// Update a vendor
exports.vendor_update = asyncHandler(async (req, res, next) => {
    const { Vendor } = require("../models/vendor");
    const { vendorName, phoneNumber, email } = req.body;

    // Validate inputs
    if (!vendorName || !phoneNumber || !email) {
        return res.status(400).json({ message: "vendorName, phoneNumber, and email are required" });
    }

    const vendor = await Vendor.findById(req.params.id).exec();
    if (!vendor) {
        return res.status(404).json({ message: "Vendor not found" });
    }

    vendor.vendorName = vendorName;
    vendor.phoneNumber = phoneNumber;
    vendor.email = email;

    await vendor.save();
    res.status(200).json({
        message: "Vendor updated successfully",
        vendor
    });
});

// Delete a vendor
exports.vendor_delete = asyncHandler(async (req, res, next) => {
    const { Vendor } = require("../models/vendor");
    const vendor = await Vendor.findById(req.params.id).exec();
    if (!vendor) {
        return res.status(404).json({ message: "Vendor not found" });
    }

    await Vendor.deleteOne({ _id: req.params.id });
    res.status(200).json({
        message: "Vendor deleted successfully"
    });
});

// Assign a shop to a vendor
exports.vendor_assign_shop = asyncHandler(async (req, res, next) => {
    const { Vendor } = require("../models/vendor");
    const { vendorId, shopId } = req.body;

    // Validate inputs
    if (!vendorId || !shopId) {
        return res.status(400).json({ message: "vendorId and shopId are required" });
    }

    const vendor = await Vendor.findById(vendorId).exec();
    if (!vendor) {
        return res.status(404).json({ message: "Vendor not found" });
    }

    const shop = await Shop.findById(shopId).exec();
    if (!shop) {
        return res.status(404).json({ message: "Shop not found" });
    }

    vendor.shop = shopId;
    await vendor.save();

    const updatedVendor = await Vendor.findById(vendorId).populate('shop').exec();
    res.status(200).json({
        message: "Shop assigned to vendor",
        vendor: updatedVendor
    });
});

// Remove a shop from a vendor
exports.vendor_remove_shop = asyncHandler(async (req, res, next) => {
    const { Vendor } = require("../models/vendor");
    const { vendorId } = req.body;

    // Validate inputs
    if (!vendorId) {
        return res.status(400).json({ message: "vendorId is required" });
    }

    const vendor = await Vendor.findById(vendorId).exec();
    if (!vendor) {
        return res.status(404).json({ message: "Vendor not found" });
    }

    vendor.shop = undefined;
    await vendor.save();

    const updatedVendor = await Vendor.findById(vendorId).populate('shop').exec();
    res.status(200).json({
        message: "Shop removed from vendor",
        vendor: updatedVendor
    });
});