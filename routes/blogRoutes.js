const express = require('express');
const router = express.Router();
const Blog = require('../models/Blogs');

// Create a new blogs
router.post('/', async (req, res) => {
  try {
    const { title, content, keywords, seoSuggestions } = req.body;
    const blog = new Blog({ title, content, keywords, seoSuggestions });
    await blog.save();
    res.json(blog);
} catch (error) {
    console.error('Error saving blog:', error);
    res.status(500).json({ error: 'Failed to save blog' });
}
  });


// Read all blogs
router.get('/', async (req, res) => {
    try {
      const blogs = await Blog.find();
      res.status(200).send(blogs);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

//   / Read a single movie by ID
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    res.json(blog);
} catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ error: 'Failed to fetch blog' });
}
});

// Update a movie by ID
router.patch('/:id', async (req, res) => {
  try {
    const { title, content, keywords, seoSuggestions } = req.body;
    const blog = await Blog.findByIdAndUpdate(
        req.params.id,
        { title, content, keywords, seoSuggestions },
        { new: true }
    );
    res.json(blog);
} catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ error: 'Failed to update blog' });
}
});

// Delete a movie by ID
router.delete('/:id', async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Blog deleted successfully' });
} catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ error: 'Failed to delete blog' });
}
});

module.exports = router;