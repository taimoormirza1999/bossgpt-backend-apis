const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const axios = require('axios');
const mongoose = require('mongoose');
const movieRoutes = require('./routes/movieRoutes');
const blogRoutes = require('./routes/blogRoutes');

dotenv.config(); 


const app = express();
app.use(cors());
app.use(express.json()); 
app.use(bodyParser.json());

app.use('/movies', movieRoutes);
app.use('/blogs', blogRoutes);
app.post('/generate-seo', async (req, res) => {
    try {
      const { title, content } = req.body;
      const apiKey = process.env.PERPLEXITY_API_KEY;
  
      const response = await axios.post(
        'https://api.perplexity.ai/v1/complete',
        {
          text: `Generate SEO suggestions for the following blog post: 
                 **Title:** ${title}
                 **Content:** ${content}
                 **Focus Keywords:** (List your target keywords here)`,
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
          },
        }
      );
  
      const seoSuggestions = response.data.text;
      res.json({ seoSuggestions });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Failed to generate SEO suggestions' });
    }
  });
// Generate content or SEO suggestions with OpenAI
app.post('/generate-seo-chatgpt', async (req, res) => {
    try {
      // const { prompt } = req.body;
      const { title } = req.body;
      const prompt = `Generate an SEO-friendly blog post in pure HTML format, focusing on the following title: ${title}. The blog post should be comprehensive and well-structured, covering the topic in detail. Do not include any Markdown formatting, code blocks, or extra characters. Only return the raw HTML content.`;



      const apiKey = process.env.OPENAI_API_KEY;
  
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4o-mini',
          store: true,
          messages: [
            { role: 'user', content: prompt },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
        }
      );
  
      const seoSuggestions = response.data.choices[0].message.content;
      res.json({ seoSuggestions });
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      res.status(500).json({ error: 'Failed to generate AI response' });
    }
  });

  // Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

  // Create a new blog post
app.post('/api/create-blog', async (req, res) => {
  try {
      const { title, content, seoSuggestions } = req.body;

      // Save blog data in your database (MongoDB, PostgreSQL, etc.)
      const newBlog = { title, content, seoSuggestions, createdAt: new Date() };

      res.status(201).json({ message: 'Blog created successfully', blog: newBlog });
  } catch (error) {
      console.error('Error:', error.message);
      res.status(500).json({ error: 'Failed to create blog' });
  }
});

// Get all blogs
app.get('/api/blogs', async (req, res) => {
  try {
    const User = mongoose.model('User', userSchema);

      // Fetch blogs from your database
      // const blogs = []; // Replace with DB query
      // User.find()
  // .then((users) => console.log('All users:', users))
  // .catch((error) => console.error('Error fetching users:', error));
  //     const blogs = ;
  //     res.json(blogs);
      // res.json(blogs);
User.find()
  .then((users) => console.log('All users:', users))
  .catch((error) => console.error('Error fetching users:', error));
  } catch (error) {
      console.error('Error:', error.message);
      res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});
  
// Example Route
app.get('/', (req, res) => {
  res.send('Welcome to Blog Dashboard APIs !');
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
