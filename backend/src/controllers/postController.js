const Post = require('../models/Post');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError } = require('../errors');
const catchAsync = require('../utils/catchAsync');

const createPost = catchAsync(async (req, res) => {
    const { title, content, category } = req.body;

    if (!title || !content || !category) {
        throw new BadRequestError('Please provide title, content and category');
    }

    let image = null;
    if (req.file) {
        // req.file is populated by the multer middleware
        image = `/uploads/${req.file.filename}`;
    }

    // req.user is populated by our authMiddleware
    const post = await Post.create({
        title,
        content,
        category,
        image,
        author: req.user.userId,
    });

    res.status(StatusCodes.CREATED).json({ post });
});

const getAllPosts = catchAsync(async (req, res) => {
    const { category, search } = req.query;
    
    let queryObject = {};

    // Filter by category if provided
    if (category) {
        queryObject.category = category;
    }
    
    // Search in title if search term is provided
    if (search) {
        queryObject.title = { $regex: search, $options: 'i' };
    }

    // Find posts, populate the author's username, and sort by newest first
    const posts = await Post.find(queryObject)
        .populate('author', 'username')
        .sort('-createdAt');
    
    res.status(StatusCodes.OK).json({ posts, count: posts.length });
});

const getSinglePost = catchAsync(async (req, res) => {
    const { id } = req.params;
    
    const post = await Post.findById(id).populate('author', 'username');
    
    if (!post) {
        throw new BadRequestError(`No post found with id: ${id}`);
    }
    
    res.status(StatusCodes.OK).json({ post });
});

module.exports = {
    createPost,
    getAllPosts,
    getSinglePost,
};
