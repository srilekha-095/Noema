const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Culture', 'Technology', 'Science', 'Art', 'Fiction', 'Opinion'], // based on the frontend blueprint
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    image: {
      type: String,
      required: false, // Stores the URL or path to the uploaded image
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);
