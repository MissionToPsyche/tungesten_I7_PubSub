
const request = require('supertest');
const httpMocks = require('node-mocks-http');


require('dotenv').config();


const { userLogin, addUser } = require('../controllers/authController');
const User = require('../model/userModel'); // Adjust the path as necessary
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Mocking User model
jest.mock('../model/userModel');

// Mocking bcrypt
bcrypt.compare = jest.fn();

// Mocking jwt
jwt.sign = jest.fn();

describe('Authentication Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Clear mocks state before each test
    });

    describe('addUser', () => {
        it('should register a new user successfully', async () => {
            User.findOne.mockResolvedValue(null); // Assuming no user found with the username
            const req = httpMocks.createRequest({
                method: 'POST',
                url: '/api/users',
                body: {   //validating the data
                    username: 'new_user',
                    password: 'Password@123',
                    full_name: 'New User',
                    date_of_birth: '1990-01-01',
                    email: 'new.user@example.com',
                },
            });
            const res = httpMocks.createResponse();
            await addUser(req, res);

            expect(res.statusCode).toBe(201);
            expect(res._getData()).toBe('User registered successfully');
        });

        it('should return error if user already exists', async () => {
            User.findOne.mockResolvedValue(true); // Simulate user found
            const req = httpMocks.createRequest({
                method: 'POST',
                url: '/api/users',
                body: { //validating for existing user
                    username: 'existing_user',
                    password: 'Password@123',
                    full_name: 'Existing User',
                    date_of_birth: '1985-01-01',
                    email: 'existing.user@example.com',
                },
            });
            const res = httpMocks.createResponse();
            await addUser(req, res);

            expect(res.statusCode).toBe(400);
            expect(res._getData()).toBe('A user already exists with this username. Please choose a different username.');
        });
    });

    describe('userLogin', () => {
        it('should log in user successfully', async () => {
            User.findOne.mockResolvedValue({
                _id: 'someUserId',
                username: 'test_user',
                comparePassword: () => Promise.resolve(true)
            });
            jwt.sign.mockReturnValue('fakeToken');
            const req = httpMocks.createRequest({
                method: 'POST',
                url: '/api/login',
                body: {
                    username: 'test_user',
                    password: 'Password123!',
                },
            });
            const res = httpMocks.createResponse();
            await userLogin(req, res);

            expect(res.statusCode).toBe(200);
            expect(JSON.parse(res._getData())).toEqual({
                message: 'User logged in successfully',
                token: 'fakeToken',
            });
        });

        it('should return error if user not found', async () => {
            User.findOne.mockResolvedValue(null);
            const req = httpMocks.createRequest({
                method: 'POST',
                url: '/api/login',
                body: {
                    username: 'unknown_user',
                    password: 'Password123!',
                },
            });
            const res = httpMocks.createResponse();
            await userLogin(req, res);

            expect(res.statusCode).toBe(404);
            expect(res._getData()).toBe(JSON.stringify({ message: 'User not found.' }));
        });
    });
});
