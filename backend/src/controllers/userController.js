const User = require('../models/User');
const Post = require('../models/Post');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError } = require('../errors');
const catchAsync = require('../utils/catchAsync');

const getCurrentUser = catchAsync(async (req, res) => {
    // Fetch user from DB without the password field
    const user = await User.findById(req.user.userId).select('-password');

    if (!user) {
        throw new BadRequestError('User does not exist');
    }

    const posts = await Post.find({ author: req.user.userId })
        .populate('author', 'username')
        .sort('-createdAt');

    res.status(StatusCodes.OK).json({
        user,
        posts,
        count: posts.length,
    });
});

module.exports = {
    getCurrentUser,
};
