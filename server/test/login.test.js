// test/login.test.js

require('dotenv').config();
const mongoose = require('mongoose');
const { userLogin } = require('../controllers/authController');
const User = require('../model/userModel');
const jwt = require('jsonwebtoken');

describe('User Authentication', () => {
    let testUser;

    beforeAll(async () => {
        // Connect to the MongoDB server using the URI from .env
        await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

        // Add a new user to the database
        const userData = { username: 'testuser', password: 'testpassword' };
        testUser = new User(userData);
        await testUser.save();
    });

    afterAll(async () => {
        // Delete the added user from the database
        await User.deleteOne({ username: 'testuser' });

        // Disconnect from the MongoDB server
        await mongoose.disconnect();
    });

    it('should login successfully', async () => {
        // Mock request and response objects
        const req = { body: { username: 'testuser', password: 'testpassword' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        // Perform login
        await userLogin(req, res);

        // Expect successful login (status 200)
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'User logged in successfully' }));
        const token = res.json.mock.calls[0][0].token;
        expect(token).toBeDefined();

        // Verify token payload
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        expect(decoded.userId).toEqual(testUser._id.toString());
    });

    it('should return 401 if user login fails', async () => {
        // Mock request and response objects with wrong password
        const req = { body: { username: 'testuser', password: 'wrongpassword' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        // Perform login with wrong password
        await userLogin(req, res);

        // Expect login failure (status 401)
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials.' });
    });
});