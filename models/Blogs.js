const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true }, 
  content: { type: String, required: true }, 
  metaTitle: { type: String, required: true }, 
  metaDescription: { type: String, required: true }, 
  metaTags: [{ type: String }], 
  coverImage: { type: String }, 
  postedBy: { type: String, required: true }, 
  postedDate: { type: Date, default: Date.now }, 
  categories: [{ type: String }],
  }, { collection: 'blogs2' } );


  

  module.exports = mongoose.model('Blog', blogSchema);

