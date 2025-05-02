// product model

const mongoose = require("mongoose");
const Schema  = mongoose.Schema;
const Product = require("../models/products");

const ProductSchema = new Schema({
    productName:{
        type: String,
        required: true,
        trime: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    description:{
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
        enum : ["Available", "Restocked", "Unavailable"],
        default: "Available"
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});
// virtual name 
UsersSchema.virtual("name").get(function(){
    let fullname = "";
    if (this.productName && this.price){
        fullname = `${this.productName}, ${this.price}`;
    }
})

UsersSchema.virtual("stock").get(function(){
    let fullStock = "";
    if(this.stock && this.productName){
        fullStock = `${this.stock}, ${this.productName}`;
    }
})
const Product = mongoose.model("Products", ProductSchema);
module.exports = {Product};