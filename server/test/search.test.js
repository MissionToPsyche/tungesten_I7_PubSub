require('dotenv').config();
const httpMocks = require('node-mocks-http');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const app = require('../app');
const { calculateRelevance } = require('../controllers/searchController');
const Document = require('../model/documentSchema');
const User = require('../model/userModel');

describe('Document Search Endpoint', () => {
    let mongoServer;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        const newUser = new User({
            username: 'User 1',
            password: 'Pass@123',
        });
        await newUser.save();
    });

    afterAll(async () => {
        await User.deleteMany({ username: 'User 1' });
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    beforeEach(async () => {
        await Document.deleteMany({});
    });

    it('should return filtered and ordered documents', async () => {
        const substring = 'example';
        const req = httpMocks.createRequest({
            method: 'GET',
            url: `/search/byTitle`,
            body: {
                substring: substring,
            },
        });

        const res = httpMocks.createResponse();

        const sampleDocuments = [
            { title: 'Example Document 1', author: 'User 1', abstract: 'Document 1', documentType: 'research paper' },
            { title: 'Another Example 2', author: 'User 1', abstract: 'Document 2', documentType: 'research paper' },
            { title: 'Yet Another Example 3', author: 'User 1', abstract: 'Document 3', documentType: 'research paper' },
        ];

        await Document.insertMany(sampleDocuments);

        await app(req, res);

        expect(res.statusCode).toBe(200);
        let responseBody = JSON.parse(res._getData());
        expect(responseBody).toBeInstanceOf(Array);

        expect(responseBody).toHaveLength(sampleDocuments.length);
        expect(responseBody[0].title).toContain(substring);

        for (let i = 1; i < responseBody.length; i++) {
            const currentScore = calculateRelevance(responseBody[i].title, substring);
            const previousScore = calculateRelevance(responseBody[i - 1].title, substring);
            expect(currentScore).toBeLessThanOrEqual(previousScore);
        }
    });

    it('should handle errors and return 500 status', async () => {
        const req = httpMocks.createRequest({
            method: 'GET',
            url: '/search/byTitle',
            body: { substring: 'example' },
        });

        const res = httpMocks.createResponse();

        const originalFind = Document.find;
        Document.find = jest.fn(() => {
            throw new Error('Test error');
        });

        await app(req, res);
        expect(res.statusCode).toBe(500);
        const responseBody = JSON.parse(res._getData());
        expect(responseBody).toHaveProperty('error', 'Internal Server Error');

        Document.find = originalFind;
    });
});
