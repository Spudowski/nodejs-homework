const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
    },
    email: {
        type: String,
        required: [true, "Email required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    subscription: {
        type: String,
        enum: ['starter', 'pro', 'business'],
        default: 'starter'
    },
    token: {
        type: String,
        default: null,
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;