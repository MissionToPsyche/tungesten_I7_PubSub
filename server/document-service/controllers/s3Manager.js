const AWS = require('aws-sdk');

// Initialize AWS S3 with your credentials
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

const s3Operations = {
    async upload(bucketName, key, data) {
        const params = {
            Bucket: bucketName,
            Key: key,
            Body: data,
        };

        try {
            const response = await s3.upload(params).promise();
            return response.Key;
        } catch (error) {
            throw error;
        }
    },

    async getData(bucketName, key) {
        const params = {
            Bucket: bucketName,
            Key: key,
        };

        try {
            const response = await s3.getObject(params).promise();
            return response.Body;
        } catch (error) {
            throw error;
        }
    },

    async deleteData(bucketName, key) {
        const params = {
            Bucket: bucketName,
            Key: key,
        };

        try {
            await s3.deleteObject(params).promise();
        } catch (error) {
            throw error;
        }
    },

    async generateSignedUrlForPut(bucketName, s3Key, duration) {
        const params = {
            Bucket: bucketName,
            Key: s3Key,
            Expires: duration
        }

        try {
            const signedUrl = await s3.getSignedUrlPromise('putObject', params);
            return signedUrl;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = s3Operations;
