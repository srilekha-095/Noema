const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');

const authMiddleware = (req, res, next) => {
    // 1. Check if the Authorization header exists and starts with 'Bearer'
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthenticatedError('Authentication invalid');
    }

    // 2. Extract the token
    const token = authHeader.split(' ')[1];

    // 3. Verify the token
    try {
        const payload = jwt.verify(token, process.env.JWT_WEB_TOKEN);
        // Attach the user ID and username to the request object
        req.user = { userId: payload.id, username: payload.username };
        next();
    } catch (error) {
        throw new UnauthenticatedError('Authentication invalid');
    }
};

module.exports = authMiddleware;
