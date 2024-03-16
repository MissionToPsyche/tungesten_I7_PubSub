require('dotenv').config();
const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require("../model/userModel");

// Ensure that mongoose is connected before running any tests
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(process.env.MONGODB_URI);
  });
  
// Close the mongoose connection after all tests are complete
afterAll(async () => {
    await mongoose.disconnect();
});

describe('GET /users/some', () => {

    it('should return matching users for valid query', async () => {
      const response = await request(app)
        .get('/users/some')
        .query({ substring: 'sud' });
  
      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.any(Array));
    });
  
    it('should return empty array for non-matching query', async () => {
      const response = await request(app)
        .get('/users/some')
        .query({ substring: 'NonExistingUser' });
  
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  
    it('should handle internal server errors', async () => {
      // Mocking the User.find method to throw an error
      jest.spyOn(User, 'find').mockImplementation(() => {
        throw new Error('Mocked Internal Server Error');
      });
  
      const response = await request(app)
        .get('/users/some')
        .query({ substring: 'sud' });
  
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Internal Server Error' });
    });
  });