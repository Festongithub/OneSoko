const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'vendor', 'customer'],
        default: 'customer'
    },
    wishlist: [{
        type: Schema.Types.ObjectId,
        ref: 'Products'
    }],
    cart: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Products'
        },
        quantity: {
            type: Number,
            default: 1,
            min: 1
        }
    }]
});

module.exports = mongoose.model('User', UserSchema);