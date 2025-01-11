const express = require('express');
const multer = require('multer');
const path = require('path');
const Post = require('../models/Post');
const Step = require('../models/Step'); // Import Step model


const router = express.Router();

// Configure multer storage to use the original file name
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads')); // Save files in the "uploads" directory
    },
    filename: (req, file, cb) => {
        const uniqueName = `${file.originalname}`;
        cb(null, uniqueName);
    },
});
const upload = multer({ storage });

const uploadImageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../postimage')); // Save files in "postimage" directory
    },
    filename: (req, file, cb) => {
        const uniqueName = `${file.originalname}`;
        cb(null, uniqueName);
    },
});
const uploadImage = multer({ storage: uploadImageStorage });

router.post('/upload-image', uploadImage.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const filePath = `/postimage/${req.file.filename}`;
        res.status(200).json({ filePath });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ error: 'Failed to upload image' });
    }
});

// Helper to create slugs
const slugify = (title) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// POST route to create a new post
router.post('/', upload.single('thumbnail'), async (req, res) => {
    try {
        const { title, meta_desc, category, steps } = req.body;

        if (!req.file) {
            return res.status(400).json({ error: 'Thumbnail is required' });
        }

        // Create the post
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const post = await Post.create({
            title,
            slug,
            thumbnail_url: `/uploads/${req.file.filename}`,
            meta_desc,
            content: 'Default content', // Add default content if not provided
            category,
        });

        // Parse and add steps to the `steps` table
        if (steps) {
            const parsedSteps = JSON.parse(steps);
            for (const step of parsedSteps) {
                await Step.create({
                    post_id: post.id,
                    title: step.title,
                    content: step.content,
                    video_url: step.video || null,
                    image_url: step.image || null,
                });
            }
        }

        res.status(201).json({ message: 'Post created successfully', post });
    } catch (err) {
        console.error('Error creating post:', err);
        res.status(500).json({ error: 'Failed to create post', details: err.message });
    }
});

// Fetch a post by slug
router.get('/:slug', async (req, res) => {
    try {
        const post = await Post.findOne({ where: { slug: req.params.slug } });

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const steps = await Step.findAll({ where: { post_id: post.id } });

        res.status(200).json({
            post,
            steps: steps.map((step) => ({
                title: step.title,
                content: step.content,
                video_url: step.video_url,
                image_url: step.image_url,
            })),
        });
    } catch (err) {
        console.error('Error fetching post by slug:', err);
        res.status(500).json({ error: 'Failed to fetch post' });
    }
});


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

// Move this to the top of the file or define it in a dedicated `stepsRoutes.js`
router.get('/steps/:postId', async (req, res) => {
    try {
        const { postId } = req.params;

        // Fetch steps for the given post_id
        const steps = await Step.findAll({ where: { post_id: postId } });

        if (!steps.length) {
            return res.status(404).json({ error: 'No steps found for this post' });
        }

        // Return the steps
        res.status(200).json(
            steps.map((step) => ({
                id: step.id,
                title: step.title,
                content: step.content,
                video: step.video_url,
                image: step.image_url,
            }))
        );
    } catch (error) {
        console.error('Error fetching steps:', error);
        res.status(500).json({ error: 'Failed to fetch steps' });
    }
});


module.exports = router;