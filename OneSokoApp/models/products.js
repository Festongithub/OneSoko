const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    productName: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    stock: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Available', 'Out of Stock'],
        required: true
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
    return `${this.productName}, ${this.price}`;
});

ProductSchema.virtual("stockInfo").get(function() {
    return `${this.stock}, ${this.productName}`;
});

const Products = mongoose.model("Products", ProductSchema);
module.exports = { Products };