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


async function uploadDocument(req, res) {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const documentTitle = "test"; // Assuming title is sent in the request body
    const author = "abc"; // Assuming author is also provided

    try {
        // Generate and upload chunks
        const data = Buffer.from(req.file.buffer);
        const chunks = await generateChunks(data);
        const chunkRefs = [];

        for (let chunk of chunks) {
            const hash = hashChunk(chunk.data);
            let chunkRef = await Chunk.findOne({ hash });

            if (!chunkRef) {
                const s3Key = await s3Operations.uploadChunk(process.env.AWS_BUCKET_NAME, hash, chunk.data);
                chunkRef = new Chunk({
                    sequence: chunk.sequence,
                    s3Key: s3Key,
                    hash: hash,
                    size: chunk.data.length,
                    referenceCount: 1
                });
                await chunkRef.save();
                chunkRefs.push(chunkRef._id);
            } else {
                chunkRef.referenceCount += 1;
                await chunkRef.save();
                chunkRefs.push(chunkRef._id);
            }
        }

        // Create a new document entry with the initial version
        const newDocument = new Document({
            title: documentTitle,
            author: author,
            documentType: "txt",
            versions: [{
                versionNumber: '1.0',
                chunks: chunkRefs,
                isDraft: false,
                changedBy: author
            }],
            currentVersion: '1.0',
        });

        await newDocument.save();

        return res.status(201).json({
            message: "Document uploaded successfully",
            documentId: newDocument._id
        });

    } catch (error) {
        console.error("Error uploading document:", error);
        return res.status(500).json({ error: error.message });
    }
}

async function getDocument(req, res) {
    const documentId = req.query.documentId;
    const versionNumber = req.query.versionNumber;

    try {
        // Find the document by ID
        const document = await Document.findOne({ _id: documentId });
        if (!document) {
            return res.status(404).json({ error: "Document not found" });
        }

        // Find the version by version number
        const version = document.versions.find(v => v.versionNumber === versionNumber);
        if (!version) {
            return res.status(404).json({ error: "Version not found" });
        }

        // Retrieve the chunks for the version
        const chunks = await Chunk.find({ _id: { $in: version.chunks } });
        // Retrieve the chunks from S3
        for (let chunk of chunks) {
            const s3Object = await s3Operations.getChunk(process.env.AWS_BUCKET_NAME, chunk.hash);
            chunk.data = s3Object;
        }
        // const chunkData = s3Objects.map(object => object.Body);
        // Set the response headers
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename=${document.title}.${document.documentType}`);

        // Stream the concatenated chunks
        for (let chunk of chunks) {
            res.write(chunk.data);
        }
        res.end();
    } catch (error) {
        console.error("Error getting document:", error);
        return res.status(500).json({ error: error.message });
    }
}

module.exports = { uploadDocument, getDocument }