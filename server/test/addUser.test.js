const request = require('supertest');
const app = require('../app');
const { expect } = require('jest');
const mongoose = require('mongoose');


describe('addUser', () => {

    beforeAll(async () => {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected');
    });

    afterAll(async () => {
        await mongoose.disconnect();
        console.log('MongoDB disconnected');
    });


    it('should register a new user successfully', async () => {
        const userData = {
            username: 'test_user',
            password: 'Password123!',
            full_name: 'Test User',
            date_of_birth: '1990-01-01',
            email: 'test.user@example.com',
        };

        const response = await request(app)
            .post('/api/users')
            .send(userData);

        expect(response.status).toBe(201);
        expect(response.text).toBe('User registered successfully');
    });

    it('should return error if user already exists', async () => {
        const userData = {
            username: 'existing_user',
            password: 'Password123!',
            full_name: 'Existing User',
            date_of_birth: '1990-01-01',
            email: 'existing.user@example.com',
        };

        const response = await request(app)
            .post('/api/users')
            .send(userData);

        expect(response.status).toBe(400);
        expect(response.text).toBe('A user already exists with this username. Please choose a different username.');
    });

});
