const asyncHandler = require("express-async-handler");
const { Vendor } = require("../models/vendor");
const { Shop } = require("../models/shop");

// List all vendors
exports.vendors_list = asyncHandler(async (req, res, next) => {
    const vendors = await Vendor.find().populate({
        path: 'shop',
        populate: { path: 'products' }
    }).exec();
    res.status(200).json({
        message: "Vendors retrieved successfully",
        vendors
    });
});

// Get a single vendor by ID
exports.vendor_detail = asyncHandler(async (req, res, next) => {
    const vendor = await Vendor.findById(req.params.id).populate({
        path: 'shop',
        populate: { path: 'products' }
    }).exec();
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
    const { vendorName, phoneNumber, email, shopId } = req.body;

    // Validate inputs
    if (!vendorName || !phoneNumber || !email) {
        return res.status(400).json({ message: "vendorName, phoneNumber, and email are required" });
    }

    // Validate shopId if provided
    if (shopId) {
        const shop = await Shop.findById(shopId).exec();
        if (!shop) {
            return res.status(404).json({ message: "Shop not found" });
        }
    }

    const vendor = new Vendor({
        vendorName,
        phoneNumber,
        email,
        shop: shopId || null
    });

    await vendor.save();
    res.status(201).json({
        message: "Vendor created successfully",
        vendor
    });
});

// Update a vendor
exports.vendor_update = asyncHandler(async (req, res, next) => {
    const { vendorName, phoneNumber, email, shopId } = req.body;

    // Validate inputs
    if (!vendorName || !phoneNumber || !email) {
        return res.status(400).json({ message: "vendorName, phoneNumber, and email are required" });
    }

    // Validate shopId if provided
    if (shopId) {
        const shop = await Shop.findById(shopId).exec();
        if (!shop) {
            return res.status(404).json({ message: "Shop not found" });
        }
    }

    const vendor = await Vendor.findById(req.params.id).exec();
    if (!vendor) {
        return res.status(404).json({ message: "Vendor not found" });
    }

    vendor.vendorName = vendorName;
    vendor.phoneNumber = phoneNumber;
    vendor.email = email;
    vendor.shop = shopId || null;

    await vendor.save();
    res.status(200).json({
        message: "Vendor updated successfully",
        vendor
    });
});

// Delete a vendor
exports.vendor_delete = asyncHandler(async (req, res, next) => {
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

    const updatedVendor = await Vendor.findById(vendorId).populate({
        path: 'shop',
        populate: { path: 'products' }
    }).exec();
    res.status(200).json({
        message: "Shop assigned to vendor successfully",
        vendor: updatedVendor
    });
});

// Remove a shop from a vendor
exports.vendor_remove_shop = asyncHandler(async (req, res, next) => {
    const { vendorId } = req.body;

    // Validate inputs
    if (!vendorId) {
        return res.status(400).json({ message: "vendorId is required" });
    }

    const vendor = await Vendor.findById(vendorId).exec();
    if (!vendor) {
        return res.status(404).json({ message: "Vendor not found" });
    }

    vendor.shop = null;
    await vendor.save();

    const updatedVendor = await Vendor.findById(vendorId).populate({
        path: 'shop',
        populate: { path: 'products' }
    }).exec();
    res.status(200).json({
        message: "Shop removed from vendor successfully",
        vendor: updatedVendor
    });
});