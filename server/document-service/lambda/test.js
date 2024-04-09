const fs = require('fs');
const AWS = require('aws-sdk');
const fossilDelta = require('fossil-delta');

// Configure the AWS SDK
AWS.config.update({
    region: 'us-west-1', // e.g., 'us-east-1'
    // credentials, if needed
});

const s3 = new AWS.S3();

async function fetchAndReconstructFile(chunkObjects, deltaObjects, outputFilePath) {
    const fileStream = fs.createWriteStream(outputFilePath);
    let chunk_buf = []
    for (const chunk of chunkObjects) {
        const params = {
            Bucket: 'pubsubrepochunkstore', // Update this to your S3 bucket name
            Key: chunk.s3_key,
        };

        console.log(`Fetching chunk: ${chunk.s3_key}`);

        // Fetch the chunk data from S3
        const data = await s3.getObject(params).promise();

        // Write the chunk data to the file stream
        chunk_buf.push(data.Body);
    }
    let deltaBuf = [];
    console.log("Fetched")
    for (const chunk of deltaObjects) {
        const params = {
            Bucket: 'pubsubrepochunkstore', // Update this to your S3 bucket name
            Key: chunk.s3_key,
        };

        console.log(`Fetching chunk: ${chunk.s3_key}`);

        // Fetch the chunk data from S3
        const data = await s3.getObject(params).promise();

        // Write the chunk data to the file stream
        deltaBuf.push(data.Body);
    }
    console.log(chunk_buf);
    console.log(deltaBuf);
    let fileData = fossilDelta.apply(Array.from(Buffer.concat(chunk_buf)), Array.from(Buffer.concat(deltaBuf)));
    fileData = Buffer.from(fileData);
    fs.writeFileSync(outputFilePath, fileData);
    console.log('File reconstructed successfully.');
}

// Example usage
const chunkObjects = [
    { sequence: 0, s3_key: "chunks/82384d63da65b37bd17f1cb0084d8f207023bc4138c9cd91ee541c41d64336e2", hash: "82384d63da65b37bd17f1cb0084d8f207023bc4138c9cd91ee541c41d64336e2", size: 36914, is_delta: false }, { sequence: 1, s3_key: "chunks/4d024383d2cb6b6cc497381c0c9bc725b967e7d101eabd575de52bd04178b3ef", hash: "4d024383d2cb6b6cc497381c0c9bc725b967e7d101eabd575de52bd04178b3ef", size: 27801, is_delta: false }, { sequence: 2, "s3_key": "chunks/97dfd4ddf564cf16b3a3c1a4996e16b1fc4eb5811f26a5cd0816afd5e452976d", hash: "97dfd4ddf564cf16b3a3c1a4996e16b1fc4eb5811f26a5cd0816afd5e452976d", size: 21541, is_delta: false }, { sequence: 3, "s3_key": "chunks/699a25c810b8462fb9410f6e7f7be458a207d14b0c205823537d0f19e43dadee", hash: "699a25c810b8462fb9410f6e7f7be458a207d14b0c205823537d0f19e43dadee", size: 23332, is_delta: false }, { sequence: 4, "s3_key": "chunks/c12ed69cef8f2d4a802f82787771f0474e73fddae054e6b2a5528fe655e563b1", hash: "c12ed69cef8f2d4a802f82787771f0474e73fddae054e6b2a5528fe655e563b1", size: 16384, is_delta: false }
    // Add the rest of your chunk objects here...
];
const deltaObjects = [
    { "sequence": 0, "s3_key": "chunks/ebe0962d7236738e91e8d6f28cfdb7b333e9ae01c06bed904403f7c70203bd70", "hash": "ebe0962d7236738e91e8d6f28cfdb7b333e9ae01c06bed904403f7c70203bd70", "size": 24912, "is_delta": true }
]
const outputFilePath = './a.x.pdf'; // Update this to your desired output file path

fetchAndReconstructFile(chunkObjects, deltaObjects, outputFilePath).catch(console.error);
