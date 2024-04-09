const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');

// Configure AWS
AWS.config.update({ region: 'us-west-1' });
const s3 = new AWS.S3();

// Your bucket name and file path
const bucketName = 'pubsubrepochunkstore';
const filePath = '/Users/schadotra/Downloads/updated_doc_2.pdf';

function splitIntoFixedChunks(buffer, numChunks) {
    const chunkSize = Math.ceil(buffer.length / numChunks);
    const chunks = [];
    for (let i = 0; i < numChunks; i++) {
        const chunkStart = i * chunkSize;
        chunks.push(buffer.slice(chunkStart, Math.min(chunkStart + chunkSize, buffer.length)));
    }
    return chunks;
}

// Upload chunk as a separate S3 object
async function uploadSingleChunk(chunk, partNumber) {
    const keyName = `chunks/${path.basename(filePath)}-part-${partNumber}`;
    const params = {
        Bucket: bucketName,
        Key: keyName,
        Body: chunk,
    };

    try {
        await s3.putObject(params).promise();
        console.log(`Uploaded chunk ${partNumber}`);
    } catch (error) {
        console.error(`Error uploading chunk ${partNumber}:`, error);
    }
}

async function uploadImageInFixedChunks() {
    try {
        // Read the file
        const fileBuffer = fs.readFileSync(filePath);

        // Split the file into 5 chunks (or any number you prefer)
        const chunks = splitIntoFixedChunks(fileBuffer, 5);

        // Upload each chunk
        for (let i = 0; i < chunks.length; i++) {
            await uploadSingleChunk(chunks[i], i + 1);
        }

        console.log('All chunks uploaded successfully.');
    } catch (error) {
        console.error('Failed to upload chunks:', error);
    }
}

uploadImageInFixedChunks();