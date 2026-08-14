const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');
const catchAsync = require('../utils/catchAsync');

const register = catchAsync(async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        throw new BadRequestError('Please provide all values');
    }

    // Note: User.findOne check is optional here because our errorMiddleware
    // will now catch the MongoDB Duplicate Key error (11000) automatically,
    // but throwing a custom error here is slightly faster and cleaner.
    const userAlreadyExists = await User.findOne({ username });
    if (userAlreadyExists) {
        throw new BadRequestError('Username already in use');
    }

    const user = await User.create({ username, password });
    const token = user.createJWT();

    res.status(StatusCodes.CREATED).json({
        user: { username: user.username },
        token,
    });
});

const login = catchAsync(async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        throw new BadRequestError('Please provide all values');
    }

    const user = await User.findOne({ username });
    if (!user) {
        throw new UnauthenticatedError('Invalid Credentials');
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError('Invalid Credentials');
    }

    const token = user.createJWT();

    res.status(StatusCodes.OK).json({
        user: { _id: user._id, username: user.username },
        token,
    });
});

module.exports = { register, login };
