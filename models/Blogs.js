const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: String,
    content: String,
    seoSuggestions: Object,
    keywords: [String],
    createdAt: { type: Date, default: Date.now },
  });

  module.exports = mongoose.model('Blog', blogSchema);

