require('dotenv').config();
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Document = require('../model/documentSchema'); // Adjust the path as necessary
const DocumentVersion = require('../model/documentVersionSchema'); // Adjust the path as necessary
const User = require('../model/userModel'); // Updated path to match your structure

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterEach(async () => {
    // Clean up data after each test to ensure isolation
    await User.deleteMany({});
    await Document.deleteMany({});
    await DocumentVersion.deleteMany({});
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('Document and DocumentVersion Models', () => {
    test('Create Document and DocumentVersion', async () => {
        const user = new User({ username: 'Test User', password: "123" }); // Ensure password is set correctly
        await user.save();

        const document = new Document({
            title: 'Test Document',
            author: user._id,
            documentType: 'research paper'
        });
        await document.save();

        const documentVersion = new DocumentVersion({
            document: document._id,
            versionNumber: 1,
            contentUrl: 'http://example.com/doc',
            changelog: 'Initial version'
        });
        await documentVersion.save();

        const savedDocument = await Document.findById(document._id).populate('author');
        const savedVersion = await DocumentVersion.findOne({ document: document._id });

        expect(savedDocument.title).toBe('Test Document');
        expect(savedDocument.author.username).toBe('Test User'); // Adjusted to check username instead of email
        expect(savedVersion.versionNumber).toBe(1);
        expect(savedVersion.contentUrl).toBe('http://example.com/doc');
    });

    // The rest of your tests follow...
});
