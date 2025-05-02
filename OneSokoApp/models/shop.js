// shop model

const mongoose = require("mongoose");
const Schema  = mongoose.Schema;

// shop schema 
const ShopSchema = new Schema({

    shopName: {
        type: String,
        required: true
    },

    description:{
        type: String,
        trim: true,
        required: true
    },

    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
    }],

    // functionality to create a virtual shop
    createdAt:{
        type: Date,
        default: Date.now
    },

    // shop location stored
    location: {
        type: String,
        enum: ["Point"],
        required: true,
        trim: true
    },
    coordinates: {
        type: [Number],
        required: true,
    },
},
    {
        timestamps: true,
        toJSON: {virtuals: true },
        toObject: { virtuals: true }
}
)

// shop virtual property
ShopSchema.virtual("name").get(function(){
    let shopFullName = "";
    if(this.shopName && this.location)
    {
        shopFullName = `${this.shopName}, ${this.location}`
    }
});
ShopSchema.index({ location: "2dsphere"});
ShopSchema.index({ shopName: 1}, { unique: true });

const Shop = mongoose.model("Shop", ShopSchema);
module.exports = {Shop}