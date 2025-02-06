const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const axios = require('axios');
const mongoose = require('mongoose');
const blogRoutes = require('./routes/blogRoutes');

dotenv.config(); 


const app = express();
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use(cors());
app.use(express.json()); 
app.use(bodyParser.json());

app.use('/blogs', blogRoutes);
// app.post('/generate-seoblogwith-images', async (req, res) => {
//   try {
//     const { title, content, focusKeywords } = req.body;
//     const apiKey = process.env.PERPLEXITY_API_KEY;

//     const response = await axios.post(
//       'https://api.perplexity.ai/chat/completions',
//       {
//         "model": "sonar-pro",
//         "messages": [
//           {
//             "role": "system",
//             "content": `You are an AI assistant that generates complete blog posts in HTML format. When given a title, create a full blog post including proper HTML structure, meta tags, meta description, meta title, and relevant content with placeholder images 3 to 4 and tags. Do not include CSS. Ensure the content is informative, engaging, and relevant to the title.`
//           },
//           {
//             "role": "user",
//             "content": `Generate a complete blog post in HTML format for the title: ${title}`
//           }
//         ]
//       }
//       ,
//       {
//         headers: {
//           'Authorization': `Bearer ${apiKey}`,
//           'Content-Type': 'application/json',
//           'Accept': 'application/json'
//         }
//       }
//     );

//     const seoSuggestions = response.data.choices[0].message.content;
//     res.json({ seoSuggestions });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'Failed to generate SEO suggestions' });
//   }
// });

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
  app.post('/generate-seoblogwith-images', async (req, res) => {
    try {
      const { title, content, focusKeywords } = req.body;
      const apiKey = process.env.PERPLEXITY_API_KEY;
  
      // Generate blog content
      const blogResponse = await axios.post(
        'https://api.perplexity.ai/chat/completions',
        {
          "model": "sonar-pro",
          "messages": [
            {
              "role": "system",
              "content": `You are an AI assistant that generates complete blog posts in HTML format. When given a title, create a full blog post including proper HTML structure, meta tags, meta description, meta title, and relevant content with placeholder images 3 to 4 and tags. Do not include CSS. Ensure the content is informative, engaging, and relevant to the title. 150 chracters max`
            },
            {
              "role": "user",
              "content": `Generate a complete blog post in HTML format for the title: ${title}`
            }
          ]
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
  
      const blogContent = blogResponse.data.choices[0].message.content;
  
      // Generate images
      const imagePrompts = [
        `Professional image representing ${title}`,
        `Illustrative visual for ${title}`,
        `Conceptual image related to ${title}`
      ];
  
      const imageUrls = [];
  
      for (const prompt of imagePrompts) {
        const imageResponse = await axios.post(
          'https://api.perplexity.ai/chat/completions',
          {
            "model": "sonar-reasoning",
            "messages": [
              {
                "role": "system", 
                "content": "Generate a descriptive image URL for the given prompt"
              },
              {
                "role": "user", 
                "content": prompt
              }
            ]
          },
          {
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          }
        );
  
        const imageUrl = imageResponse.data.choices[0].message.content;
        imageUrls.push(imageUrl);
      }
  
      // Insert images into blog content
      const fullBlogPost = insertImagesIntoBlogContent(blogContent, imageUrls);
  
      res.json({ 
        blogPost: fullBlogPost,
        images: imageUrls 
      });
  
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ 
        error: 'Failed to generate blog post with images',
        details: error.message 
      });
    }
  });
  function insertImagesIntoBlogContent(content, imageUrls) {
    let modifiedContent = content;
    
    imageUrls.forEach((url, index) => {
      const imgTag = `
        <img 
          src="${url}" 
          alt="Image ${index + 1} for blog post" 
          width="800" 
          height="600" 
          class="responsive-image"
        >
      `;
      
      // Replace placeholder or insert at appropriate location
      modifiedContent = modifiedContent.replace(
        `<!-- Insert Perplexity-generated image here -->`, 
        imgTag
      );
    });
    
    return modifiedContent;
  }
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
