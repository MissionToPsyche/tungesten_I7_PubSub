const express = require('express');
const router = express.Router();
const { userLogin, addUser } = require('../controllers/authController');
// Login endpoint
router.post('/login', userLogin);

// Endpoint for adding a user
router.post('/add-user', addUser);

//router.put('/profile/update', updateProfile);


module.exports = router;
