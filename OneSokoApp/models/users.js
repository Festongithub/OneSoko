// users model 

const mongoose = require("mongoose");
const Schema  = mongoose.Schema;
const Product = require("../models/products");
// users schema 

const UsersSchema  = new Schema({
    username: {
        type: String,
        required: true,
        maxLength: 10,
        unique: true,
        trim: true
    },
    email:{
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
    // Ensure to import the products
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products'
    }],
    cart: [{
        product:{
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
    createdAt:{
        type: Date,
        default: Date.now
    }
});

// virtual properties 
UsersSchema.virtual("name").get(function(){
    let fullname = "";
    if (this.username && this.email){
        fullname = `${this.username}, ${this.email}`;
    }
})


UsersSchema.virtual("url").get(function(){
    return `/OneSoko/user/${this._id}`;
});

module.exports = mongoose.model("Users", UsersSchema);