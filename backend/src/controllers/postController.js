const Post = require('../models/Post');
const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');
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
    const { category, search, author, page = 1, limit = 10 } = req.query;

    let queryObject = {};

    // Filter by category if provided
    if (category) {
        queryObject.category = category;
    }

    // Filter by author if provided
    if (author) {
        queryObject.author = author;
    }

    // Search by title or author username if a search term is provided
    if (search) {
        const matchingUsers = await User.find({
            username: { $regex: search, $options: 'i' },
        }).select('_id');

        const userIds = matchingUsers.map((user) => user._id);

        queryObject.$or = [
            { title: { $regex: search, $options: 'i' } },
        ];

        if (userIds.length > 0) {
            queryObject.$or.push({ author: { $in: userIds } });
        }
    }

    const skip = (Number(page) - 1) * Number(limit);

    const totalPosts = await Post.countDocuments(queryObject);

    const posts = await Post.find(queryObject)
        .populate('author', 'username')
        .sort('-createdAt')
        .skip(skip)
        .limit(Number(limit));

    res.status(StatusCodes.OK).json({
        posts,
        count: posts.length,
        totalPosts,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(totalPosts / Number(limit)),
    });
});

const getSinglePost = catchAsync(async (req, res) => {
    const { id } = req.params;

    const post = await Post.findById(id).populate('author', 'username');

    if (!post) {
        throw new BadRequestError(`No post found with id: ${id}`);
    }

    res.status(StatusCodes.OK).json({ post });
});

const updatePost = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { title, content, category } = req.body;

    const post = await Post.findById(id);

    if (!post) {
        throw new BadRequestError(`No post found with id: ${id}`);
    }

    if (post.author.toString() !== req.user.userId) {
        throw new UnauthenticatedError('You are not authorized to update this post');
    }

    if (title) post.title = title;
    if (content) post.content = content;
    if (category) post.category = category;

    await post.save();

    const updatedPost = await Post.findById(id).populate('author', 'username');
    res.status(StatusCodes.OK).json({ post: updatedPost });
});

const deletePost = catchAsync(async (req, res) => {
    const { id } = req.params;

    const post = await Post.findById(id);

    if (!post) {
        throw new BadRequestError(`No post found with id: ${id}`);
    }

    if (post.author.toString() !== req.user.userId) {
        throw new UnauthenticatedError('You are not authorized to delete this post');
    }

    await post.deleteOne();

    res.status(StatusCodes.OK).json({ msg: 'Post deleted successfully' });
});

module.exports = {
    createPost,
    getAllPosts,
    getSinglePost,
    updatePost,
    deletePost,
};
