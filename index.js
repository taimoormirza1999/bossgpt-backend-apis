const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const axios = require('axios');
const mongoose = require('mongoose');
const blogRoutes = require('./routes/blogRoutes');
const compression = require('compression');

dotenv.config(); 

const app = express();

app.use(compression());
app.use(cors());
app.use(express.json()); 
app.use(bodyParser.json());

app.use('/blogs', blogRoutes);
  // Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  // .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
