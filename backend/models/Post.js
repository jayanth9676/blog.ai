const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true },
    subTopics: [{ type: String }],
    author: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        bio: { type: String }
    },
    imageUrl: { type: String },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Post', postSchema);