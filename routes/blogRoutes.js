const express = require('express');
const router = express.Router();
const Blog = require('../models/Blogs');
const mongoose = require('mongoose');

// Client
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const blogs = await Blog.find({ status: "published" }, {
      title: 1,
      coverImage: 1,
      postedBy: 1,
      postedDate: 1,
      categories: 1,
      friendlyUrl: 1,
      _id: 1
    }).limit(limit);

    res.status(200).send(blogs);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Create a new blogs
router.post('/', async (req, res) => {
  try {
    const { title, content, metaTitle, metaDescription, metaTags,coverImage,postedBy,postedDate,categories,status,friendlyUrl } = req.body;
    const blog = new Blog({ title, content, metaTitle, metaDescription, metaTags,coverImage,postedBy,postedDate,categories,status,friendlyUrl });
    await blog.save();
    res.json(blog);
} catch (error) {
    console.error('Error saving blog:', error.message);
    res.status(500).json({ error: 'Failed to save blog' });
}
  });


// Read all blogs

router.get('/admin', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const blogs = await Blog.find({  }, {
      title: 1,
      coverImage: 1,
      postedBy: 1,
      postedDate: 1,
      categories: 1,
      metaTitle: 1,
      metaDescription: 1,
      status: 1,
      _id: 1
    }).limit(limit);

    res.status(200).send(blogs);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
router.get('/recent-blogs', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const blogs = await Blog.find({ status: "published" }, {
      title: 1,
      coverImage: 1,
      postedBy: 1,
      postedDate: 1,
      friendlyUrl: 1,
      _id: 1
    }).limit(limit);
    res.status(200).send(blogs);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//   / Read a single blog by ID
router.get('/post/:friendlyUrl', async (req, res) => {
  try {
    const friendlyUrl = req.params.friendlyUrl;
    const blog = await Blog.findOne({ friendlyUrl: { $regex: new RegExp(friendlyUrl, 'i') } });

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ error: 'Failed to fetch blog' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const blogId = req.params.id;

    // Validate the blog ID format
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res.status(400).json({ error: 'Invalid Blog ID format' });
    }

    // Fetch the blog
    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    // Respond with the blog
    res.json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ error: 'Failed to fetch blog' });
  }
});

// Update a blog by ID
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

// Delete a blog by ID
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