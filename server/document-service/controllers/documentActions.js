const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const awsSdk = require('aws-sdk');
const fastcdc = require('fastcdc');
const fossilDelta = require('fossil-delta');
const Document = require('../models/Document').Document;
const Chunk = require('../models/Document').Chunk;
const s3Operations = require('./s3Manager');

function hashChunk(chunk) {
    const hash = crypto.createHash('sha256');
    hash.update(chunk);
    return hash.digest('hex');
}

// Function to generate chunks and their hashes
function generateChunks(data) {
    const sizes = fastcdc(data, { min: 1024, avg: 4096, max: 16384 });
    let chunks = [];
    let offset = 0;
    let i = 0;
    for (let size of sizes) {
        const chunk = data.slice(offset, offset + size);
        const hash = hashChunk(chunk);
        chunks.push({ sequence: i, data: chunk, hash: hash });
        offset += size;
        i += 1;
    }

    return chunks;
}

async function requestSignedUrl(req, res) {
    const { documentTitle, author, totalChunks } = req.body;
    const documentId = new mongoose.Types.ObjectId();
    const documentFolder = `${author}/${documentTitle.replace(/\s+/g, '-')}-${documentId}`;

    let signedUrls = [];
    let tempChunkIds = [];

    try {
        for (let i = 1; i <= totalChunks; i++) {
            const s3Key = `${documentFolder}/chunk${i}`;
            const signedUrl = await s3Operations.generateSignedUrlForPut(process.env.AWS_BUCKET_NAME, s3Key, 60 * 15);
            signedUrls.push({ s3Key, signedUrl });

            // Save the temp chunk info (without hash and size yet)
            const tempChunk = new Chunk({
                sequence: i,
                s3Key: s3Key,
                hash: "temp",
                size: 0,
                referenceCount: 0 // Temporary, will be updated once chunk is processed
            });
            await tempChunk.save();
            tempChunkIds.push(tempChunk._id);
        }

        // Save the document with the temporary chunk references
        const newDocument = new Document({
            title: documentTitle,
            author: author,
            versions: [{
                versionNumber: '1.0',
                tempChunks: tempChunkIds,
                isDraft: true,
                changedBy: author
            }],
            currentVersion: '1.0',
        });
        await newDocument.save();

        res.json({
            message: "Signed URLs generated successfully",
            signedUrls,
            documentId: newDocument._id
        });
    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({ error: error.message });
    }
}


module.exports = { uploadDocument, getDocument }