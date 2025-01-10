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

const slugify = (title) => 
    title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

router.post('/', upload.single('thumbnail'), async (req, res) => {
    try {
        const { title, meta_desc, content, category } = req.body;

        const parsedContent = JSON.parse(content).filter(
            (item) => item.type && item.value.trim()
        );

        const slug = slugify(title);
        const thumbnail_url = req.file ? `/uploads/${req.file.originalname}` : '';

        const post = await Post.create({
            title,
            slug,
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

// Fetch a post by slug
router.get('/:slug', async (req, res) => {
    try {
        const post = await Post.findOne({ where: { slug: req.params.slug } });
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.status(200).json(post);
    } catch (err) {
        console.error('Error fetching post by slug:', err);
        res.status(500).json({ error: 'Failed to fetch post' });
    }
});
// routes/postRoutes.js

// Get all posts
router.get('/', async (req, res) => {
    try {
        const { category } = req.query;
        const whereCondition = category
            ? { category: decodeURIComponent(category) }
            : {};

        const posts = await Post.findAll({
            where: whereCondition,
            order: [['createdAt', 'DESC']],
        });

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