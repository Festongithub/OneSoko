// Vendor  model design

const mongoose = require("mongoose");
const Schema  = mongoose.Schema;
const Product = require("../models/products");
const Shop = require("../models/shop");

const VendorSchema = new Schema({
    vendorName: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    phoneNumber:{
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
});

VendorSchema.virtual("Details").get(function(){
    let VendorDetails = "";
    if(this.vendorName && this.phoneNumber){
        VendorDetails = `${this.VendorSchema}, ${this.phoneNumber}`;
    }
});

module.exports = mongoose.model("Vendor", VendorSchema);