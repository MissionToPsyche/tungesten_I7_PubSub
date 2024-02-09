const mongoose = require('mongoose');

const documentVersionSchema = new mongoose.Schema({
    document: { type: mongoose.Schema.Types.ObjectId, ref: 'Document' },
    versionNumber: { type: Number, required: true },
    contentUrl: { type: String, required: true },
    changelog: { type: String, required: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DocumentVersion', documentVersionSchema);
