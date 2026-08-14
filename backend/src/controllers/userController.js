const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError } = require('../errors');
const catchAsync = require('../utils/catchAsync');

const getCurrentUser = catchAsync(async (req, res) => {
    // Fetch user from DB without the password field
    const user = await User.findById(req.user.userId).select('-password');
    
    if (!user) {
        throw new BadRequestError('User does not exist');
    }
    
    res.status(StatusCodes.OK).json({ user });
});

module.exports = {
    getCurrentUser,
};
