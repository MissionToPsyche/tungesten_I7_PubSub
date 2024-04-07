const express = require('express');

const authRouter = express.Router();
const { userLogin, addUser } = require('../controllers/authController');

// Login endpoint
authRouter.post('/login', userLogin);

// Endpoint for adding a user
authRouter.post('/add-user', addUser);

module.exports = authRouter;

