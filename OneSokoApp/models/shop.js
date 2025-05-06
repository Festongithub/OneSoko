const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ShopSchema = new Schema({
    shopName: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'Products'
    }]
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

ShopSchema.index({ location: '2dsphere' });

ShopSchema.virtual('name').get(function() {
    return `${this.shopName}, ${this.location.type}`;
});

const Shop = mongoose.model("Shop", ShopSchema);
module.exports = { Shop };