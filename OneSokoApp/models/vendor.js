const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VendorSchema = new Schema({
    vendorName: {
        type: String,
        required: true,
        trim: true
    },
    phoneNumber: {
        type: Number,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop'
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

VendorSchema.virtual('Details').get(function() {
    return `${this.vendorName}, ${this.phoneNumber}`;
});

// Prevent model overwrite with try-catch
let Vendor;
try {
    Vendor = mongoose.model("Vendor");
} catch (error) {
    Vendor = mongoose.model("Vendor", VendorSchema);
}
module.exports = { Vendor };