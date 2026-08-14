const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, 'Please provide username'],
            unique: true,
            minlength: [3, 'Username must be at least 3 characters long'],
            maxlength: [25, 'Username must be at most 25 characters long'],
            trim: true,
        },
        password: {
            type: String,
            required: [true, 'Please provide password'],
            minlength: [8, 'Password must be at least 8 characters long'],
        },
    },
    { timestamps: true }
);

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.createJWT = function () {
    return jwt.sign({ id: this._id, username: this.username },
        process.env.JWT_WEB_TOKEN,
        { expiresIn: process.env.JWT_LIFETIME }
    );
};

userSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
};

module.exports = mongoose.model('User', userSchema);
