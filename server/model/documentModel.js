const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    title: { type: String, unique: true, required: true },
    content: { type: String, required: false },
    metadata: {
      uploadDate: { type: Date, default: Date.now },
      ownerUsername: { type: String, required: true }
    }
  });

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;