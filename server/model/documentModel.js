const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  document: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

const documentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: false },
  metadata: {
    uploadDate: { type: Date, default: Date.now },
    ownerUsername: { type: String, required: true }
  },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
});

module.exports = mongoose.model('Comment', commentSchema);

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;