const express = require('express');
const router = express.Router();
const { createPost, getAllPosts, getSinglePost } = require('../controllers/postController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// Base route: /api/v1/posts
router.route('/')
    .post(authMiddleware, upload.single('image'), createPost) // Protected, handles image upload
    .get(getAllPosts); // Public, fetches all posts

// Single post route: /api/v1/posts/:id
router.route('/:id')
    .get(getSinglePost); // Public, fetches one post

module.exports = router;
