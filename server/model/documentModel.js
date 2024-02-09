const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    abstract: { type: String, optional: true },
    keywords: [{ type: String }],
    publicationDate: { type: Date },
    documentType: {
        type: String,
        required: true,
        enum: ['research paper', 'article', 'presentation', 'report', 'other'],
        default: 'other'
    },
    // Replacing accessLevel with accessControls to support multiple access levels
    accessControls: [{
        entity: { type: mongoose.Schema.Types.ObjectId, refPath: 'accessControls.entityType' },
        entityType: { type: String, enum: ['User', 'Team'] }, // Determines if the entity is a User or a Team
        permissions: [{ type: String, enum: ['read', 'edit', 'delete', 'share'] }] // Array of permissions
    }],
    versions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DocumentVersion' }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Document', documentSchema);
