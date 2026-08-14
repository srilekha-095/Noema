const express = require('express');
const router = express.Router();
const { getCurrentUser } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

// Get current logged in user (Protected Route)
router.route('/me').get(authMiddleware, getCurrentUser);

module.exports = router;
