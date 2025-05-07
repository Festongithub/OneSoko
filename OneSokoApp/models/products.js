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
        required: true,
        min: 0
    },
    description: {
        type: String,
        trim: true
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['Available', 'Out of Stock'],
        default: 'Available'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

ProductSchema.virtual('name').get(function() {
    return `${this.productName}, ${this.price}`;
});

ProductSchema.virtual('stockInfo').get(function() {
    return `${this.stock}, ${this.productName}`;
});

// Prevent model overwrite with try-catch
let Products;
try {
    Products = mongoose.model("Products");
} catch (error) {
    Products = mongoose.model("Products", ProductSchema);
}
module.exports = { Products };