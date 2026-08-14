require("dotenv").config();
const express = require('express');
const connectDB = require('./config/db');
const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

// Make uploads folder publicly accessible
app.use('/uploads', express.static('uploads'));

// Routers
const authRouter = require('./routes/authRoutes');
const postRouter = require('./routes/postRoutes');
const userRouter = require('./routes/userRoutes');
const cors = require('cors');

app.use(cors());

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/users', userRouter);

// Error Middleware
app.use(errorMiddleware);

const start = async () => {
    try {
        await connectDB(process.env.MONGO_DB); // Using MONGO_DB as it is named in your .env
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}...`);
        });
    } catch (error) {
        console.log(error);
    }
};

start();