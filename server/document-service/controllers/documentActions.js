const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const awsSdk = require('aws-sdk');
const Document = require('../models/Document').Document;
const Chunk = require('../models/Document').Chunk;
const s3Operations = require('./s3Manager');

async function requestTempSignedUrl(documentTitle, author, totalChunks) {
    const documentFolder = `${author}/${documentTitle.replace(/\s+/g, '-')}-${documentId}`;
    let signedUrls = [];
    let tempChunkIds = [];
    try {
        for (let i = 1; i <= totalChunks; i++) {
            const s3Key = `${documentFolder}/chunk${i}`;
            const signedUrl = await s3Operations.generateSignedUrlForPut(process.env.AWS_BUCKET_NAME, s3Key, 60 * 15);
            signedUrls.push({ s3Key, signedUrl });
            const tempChunk = new Chunk({
                sequence: i,
                s3Key: s3Key,
                hash: "temp",
                size: 0,
                referenceCount: 0
            });
            await tempChunk.save();
            tempChunkIds.push(tempChunk._id);
        }
        return { signedUrls, tempChunkIds };
    } catch (error) {
        console.error("Error processing request:", error);
    }
}

async function requestToUploadDocument(req, res) {
    const { documentTitle, author, totalChunks } = req.body;
    const { signedUrls, tempChunkIds } = await requestTempSignedUrl(documentTitle, author, totalChunks);
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

module.exports = { requestToUploadDocument, getDocument }