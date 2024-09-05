const express = require('express');
const Post = require('../models/Post');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// POST a new post
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { title, content, category, author, subTopics } = req.body;
        if (!title || !content || !category || !author || !subTopics) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const newPost = new Post({
            title,
            content,
            category,
            author: JSON.parse(author),
            subTopics: JSON.parse(subTopics),
            imageUrl: req.file ? `/uploads/${req.file.filename}` : null
        });

        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (err) {
        console.error('Error creating post:', err);
        res.status(400).json({ message: 'Error creating post', error: err.message });
    }
});

// PUT update a post
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const { title, content, category, author, subTopics } = req.body;
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            {
                title,
                content,
                category,
                author: JSON.parse(author),
                subTopics: JSON.parse(subTopics),
                imageUrl: req.file ? `/uploads/${req.file.filename}` : req.body.imageUrl
            },
            { new: true }
        );
        if (!updatedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json(updatedPost);
    } catch (err) {
        res.status(400).json({ message: 'Error updating post', error: err.message });
    }
});

// GET all categories
router.get('/categories', async (req, res) => {
    try {
        const categories = await Post.distinct('category');
        res.json(categories);
    } catch (err) {
        console.error('Error fetching categories:', err);
        res.status(500).json({ message: 'Error fetching categories' });
    }
});

// GET all posts with pagination and optional category filter
router.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const category = req.query.category;

    try {
        let query = {};
        if (category) {
            query.category = category;
        }

        const posts = await Post.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Post.countDocuments(query);

        res.json({
            posts,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            hasMore: skip + posts.length < total
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET a specific post
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching post', error: err.message });
    }
});

// DELETE a post
router.delete('/:id', async (req, res) => {
    try {
        const deletedPost = await Post.findByIdAndDelete(req.params.id);
        if (!deletedPost) return res.status(404).json({ message: 'Post not found' });
        res.json({ message: 'Post deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;