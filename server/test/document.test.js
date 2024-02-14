const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app'); 
const User = require('../model/userModel');
const Document = require('../model/documentModel');


const agent = request(app);

describe('Document Controller', () => {
  describe('POST /docs/upload', () => {
    it('should upload a new document', async () => {
      const response = await agent
        .post('/docs/upload')
        .send({
          title: 'Test Document 1',
          content: 'This is a test document content.',
          ownerUsername: 'testuser'
        });

      expect(response.statusCode).to.equal(200);
      expect(response.body.title).to.equal('Test Document 1');
      expect(response.body.content).to.equal('This is a test document content.');
      expect(response.body.metadata.ownerUsername).to.equal('testuser');
    });

    it('should enforce title uniqueness', async () => {
      const existingDocument = new Document({
        title: 'Test Document 2',
        content: 'This is another test document content.',
        metadata: { ownerUsername: 'testusername1' }
      });
      await existingDocument.save();
      const response = await agent
        .post('/docs/upload')
        .send({
          title: 'Test Document 2',
          content: 'This is a test document content.',
          ownerUsername: 'testusername2'
        });

      expect(response.statusCode).to.equal(400);
      expect(response.body.error).to.equal('A Document already exists with the same title.');
    });
  });
});
