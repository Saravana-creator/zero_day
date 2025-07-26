const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Post = require('../models/Post');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});
const upload = multer({ storage: storage });

// Get all posts
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'name email').sort({ date: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create post (admin only)
router.post('/', adminAuth, upload.single("image"), async (req, res) => {
  try {
    const { title, description, type } = req.body;
    const image = req.file ? req.file.filename : null;

    const post = new Post({
      title,
      description,
      type,
      image,
      author: req.user._id
    });

    await post.save();
    await post.populate('author', 'name email');
    
    res.status(201).json({ message: "Post created", post });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete post (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Delete image file if exists
    if (post.image) {
      const imagePath = path.join(__dirname, '../uploads', post.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;