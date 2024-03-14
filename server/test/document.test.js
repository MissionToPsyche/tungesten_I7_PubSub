require('dotenv').config();
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { Document, Comment } = require('../model/documentSchema'); // Adjust the path as necessary
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
const { uploadDocument, getAllDocuments, getDocumentsByUsername, postNewCommentOnTheDocument } = require('../controllers/documentController');
const httpMocks = require('node-mocks-http');

jest.mock('../model/documentSchema'); // Mock the Document model

describe('Document Controller', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  describe('uploadDocument', () => {
    it('should upload a new document', async () => {
      Document.findOne.mockResolvedValue(null); // Assume no document exists with the title
      Document.prototype.save = jest.fn().mockResolvedValue({
        title: 'Test Document 1',
        content: 'This is a test document content.',
        metadata: { ownerUsername: 'testuser' }
      });

      const req = httpMocks.createRequest({
        method: 'POST',
        url: '/docs/upload',
        body: {
          title: 'Test Document 1',
          content: 'This is a test document content.',
          ownerUsername: 'testuser'
        }
      });
      const res = httpMocks.createResponse();

      await uploadDocument(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toHaveProperty('title', 'Test Document 1');
      expect(res._getJSONData()).toHaveProperty('content', 'This is a test document content.');
      expect(res._getJSONData().metadata).toHaveProperty('ownerUsername', 'testuser');
    });

    it('should enforce title uniqueness', async () => {
      Document.findOne.mockResolvedValue(true); // Simulate existing document

      const req = httpMocks.createRequest({
        body: {
          title: 'Test Document 2',
          content: 'This is a test document content.',
          ownerUsername: 'testusername2'
        }
      });
      const res = httpMocks.createResponse();

      await uploadDocument(req, res);

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toHaveProperty('error', 'A Document already exists with the same title.');
    });
  });

  describe('getAllDocuments', () => {
    it('should return all documents', async () => {
      const mockDocuments = [
        { title: 'Document 1', content: 'Content for document 1', metadata: { ownerUsername: 'user1' } },
        { title: 'Document 2', content: 'Content for document 2', metadata: { ownerUsername: 'user2' } }
      ];
      Document.find.mockResolvedValue(mockDocuments);

      const req = httpMocks.createRequest({
        method: 'GET',
        url: '/docs'
      });
      const res = httpMocks.createResponse();

      await getAllDocuments(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData().length).toBe(2);
      expect(res._getJSONData()).toEqual(mockDocuments);
    });

    it('should handle errors', async () => {
      Document.find.mockRejectedValue(new Error('Failed to fetch documents'));

      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();

      await getAllDocuments(req, res);

      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toHaveProperty('error', 'Failed to fetch documents');
    });
  });
});
