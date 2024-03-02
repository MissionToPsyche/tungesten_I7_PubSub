const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    author: { type: String, ref: 'User', required: true },
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
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Document', documentSchema);
