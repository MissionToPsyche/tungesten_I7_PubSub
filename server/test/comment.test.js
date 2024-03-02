require('dotenv').config();
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { Document, Comment } = require('../model/documentSchema'); // Adjust the path as necessary
const { postNewCommentOnTheDocument } = require('../controllers/documentController');
const httpMocks = require('node-mocks-http');

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterEach(async () => {
    await Comment.deleteMany({});
    await Document.deleteMany({});
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('Post New Comment on Document', () => {
    let savedDocument;

    beforeEach(async () => {
        // Create and save a new document before each test
        const documentData = {
            title: 'Test Document',
            author: new mongoose.Types.ObjectId(), // Simulate a user ID
            documentType: 'research paper'
        };
        savedDocument = new Document(documentData);
        await savedDocument.save();
    });

    it('successfully adds a comment to a document', async () => {
        const req = httpMocks.createRequest({
            method: 'POST',
            url: `/documents/${savedDocument._id}/comments`,
            params: { id: savedDocument._id.toString() },
            body: { text: 'Nice article!', createdBy: new mongoose.Types.ObjectId() }, // Simulate a user ID
        });
        const res = httpMocks.createResponse();

        await postNewCommentOnTheDocument(req, res);

        const comments = await Comment.find({ document: savedDocument._id });
        expect(res.statusCode).toBe(201);
        expect(comments.length).toBe(1);
        expect(comments[0].text).toBe('Nice article!');
    });

    it('returns 400 when document is not found', async () => {
        const req = httpMocks.createRequest({
            method: 'POST',
            url: '/documents/nonexistentId/comments',
            params: { id: 'nonexistentId' },
            body: { text: 'This comment will not be saved.', createdBy: new mongoose.Types.ObjectId() },
        });
        const res = httpMocks.createResponse();

        await postNewCommentOnTheDocument(req, res);

        expect(res.statusCode).toBe(400);
        expect(JSON.parse(res._getData())).toHaveProperty('message', 'Document not found');
    });

    // Test: Returns 400 for invalid comment payload
    it('returns 400 for invalid comment payload', async () => {
        const req = httpMocks.createRequest({
            method: 'POST',
            params: { id: savedDocument._id.toString() },
            body: {}, // Missing required fields such as text and createdBy
        });
        const res = httpMocks.createResponse();

        await postNewCommentOnTheDocument(req, res);

        expect(res.statusCode).toBe(400);
        expect(JSON.parse(res._getData())).toHaveProperty('message', 'Error adding comment');
    });
});