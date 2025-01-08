const express = require('express');
const multer = require('multer');
const path = require('path');
const Post = require('../models/Post');

const router = express.Router();

// Configure multer storage to use the original file name
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads'); // Specify the uploads folder
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Save file with its original name
    },
});

const upload = multer({ storage });

// Post creation route
router.post('/', upload.single('thumbnail'), async (req, res) => {
    try {
        const { title, meta_desc, content, category} = req.body;
        
        // Parse and filter content
        const parsedContent = JSON.parse(content).filter(
            (item) => item.type && item.value.trim() // Exclude empty or invalid objects
        );

        const thumbnail_url = req.file ? `/uploads/${req.file.originalname}` : ''; // Use original file name for URL

        const post = await Post.create({
            title,
            thumbnail_url,
            meta_desc,
            content: JSON.stringify(parsedContent),
            category,
        });

        res.status(201).json(post);
    } catch (err) {
        console.error('Error creating post:', err);
        res.status(500).json({ error: 'Failed to create post' });
    }
});

// routes/postRoutes.js

router.get('/', async (req, res) => {
    try {
        const { category } = req.query;

        // Normalize category by replacing underscores with spaces
        const normalizedCategory = category ? category.replace(/_/g, ' ') : null;

        // Add filtering condition
        const whereCondition = normalizedCategory ? { category: normalizedCategory } : {};

        // Fetch posts based on the condition
        const posts = await Post.findAll({ where: whereCondition });
        res.status(200).json(posts);
    } catch (err) {
        console.error('Error fetching posts:', err);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

// Get a specific post by ID
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.status(200).json(post);
    } catch (err) {
        console.error('Error fetching post:', err);
        res.status(500).json({ error: 'Failed to fetch post' });
    }
});

// Delete a post
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findByPk(id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        await post.destroy();
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (err) {
        console.error('Error deleting post:', err);
        res.status(500).json({ error: 'Failed to delete post' });
    }
});

// Get posts by category
router.get('/category/:category', async (req, res) => {
    try {
        const { category } = req.params;
        const posts = await Post.findAll({ where: { category } });
        res.status(200).json(posts);
    } catch (err) {
        console.error('Error fetching posts by category:', err);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

// Update a post category
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, meta_desc, content, category } = req.body;

        // Find the post by ID
        const post = await Post.findByPk(id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Update the post
        await post.update({
            title: title || post.title,
            meta_desc: meta_desc || post.meta_desc,
            content: content || post.content,
            category: category || post.category,
        });

        res.status(200).json(post);
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ error: 'Failed to update post' });
    }
});

module.exports = router;