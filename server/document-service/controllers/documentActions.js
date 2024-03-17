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


module.exports = { uploadDocument, getDocument }