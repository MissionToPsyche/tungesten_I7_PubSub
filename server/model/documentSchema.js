const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    abstract: { type: String },
    keywords: [{ type: String }],
    publicationDate: { type: Date, default: Date.now },
    documentType: {
        type: String,
        required: true,
        enum: ['research paper', 'article', 'presentation', 'report', 'other']
    },
    accessControls: [{
        entity: { type: mongoose.Schema.Types.ObjectId, refPath: 'accessControls.entityType' },
        entityType: { type: String, enum: ['User', 'Team'] },
        permissions: [{ type: String, enum: ['read', 'edit', 'delete', 'share'] }]
    }],
    versions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DocumentVersion' }],
    createdAt: { type: Date, default: Date.now },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    fileUrl: { type: String }
});

const commentSchema = new mongoose.Schema({
    text: { type: String, required: true },
    document: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
});

const Document = mongoose.model('Document', documentSchema);
const Comment = mongoose.model('Comment', commentSchema);

module.exports = { Document, Comment }; 
