const mongoose = require('mongoose');

const ChunkSchema = new mongoose.Schema({
    sequence: { type: Number, required: true },
    s3Key: { type: String, required: true },
    hash: { type: String, required: true },
    size: { type: Number, required: true },
    referenceCount: { type: Number, required: true, default: 1 }
});

const DocumentDeltaSchema = new mongoose.Schema({
    sequence: { type: Number, required: true },
    chunks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chunk', required: true }]
}, { _id: false });

const DocumentVersionSchema = new mongoose.Schema({
    tempChunks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chunk'
    }],
    versionNumber: { type: String, required: true },
    chunks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chunk', required: true }],
    deltas: [DocumentDeltaSchema],
    isDraft: { type: Boolean, default: false },
    createdDate: { type: Date, default: Date.now },
    changedBy: { type: String, required: true }
}, { _id: false });

const DocumentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    abstract: { type: String, optional: true },
    keywords: [{ type: String }],
    publicationDate: { type: Date, default: Date.now },
    documentType: { type: String, required: true, enum: ['txt', 'pdf', 'docx', 'pptx', 'other'] },
    accessControls: [{
        entity: { type: String, required: true },
        permissions: [{ type: String, enum: ['read', 'edit', 'delete', 'share'] }]
    }],
    versions: [DocumentVersionSchema],
    currentVersion: { type: String },
    lock: {
        isLocked: { type: Boolean, default: false },
        lockedBy: { type: String, optional: true },
        lockAcquiredAt: { type: Date, optional: true }
    },
    createdAt: { type: Date, default: Date.now }
});

const Document = mongoose.model('Document', DocumentSchema);
const Chunk = mongoose.model('Chunk', ChunkSchema);

module.exports = { Document, Chunk };
