const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  authorName: { type: String, required: true },
  authorEmail: { type: String, required: true },
  content: { type: String, required: true },
  status: { type: String, required: true, default: 'pending' },
  postedDate: { type: Date, default: Date.now },
});

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  metaTitle: { type: String, required: true },
  metaDescription: { type: String, required: true },
  metaTags: [{ type: String }],
  status: { type: String , default: 'published'},
  coverImage: { type: String },
  postedBy: { type: String, required: true },
  postedDate: { type: Date, default: Date.now },
  friendlyUrl: { type: String, required: true },
  categories: [{ type: String }],
  comments: [commentSchema], 
}, { collection: 'blogs2' });


  

  module.exports = mongoose.model('Blog', blogSchema);

