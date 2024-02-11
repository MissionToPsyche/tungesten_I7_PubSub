const express = require('express');
const router = express.Router();
const upload = require('../uploadConfig');
const { userLogin, addUser, updateUserProfile, updateUserByAdmin, deleteUserByAdmin } = require('../services/userService');
const checkUserExists = require('../middleware/checkUserExists');
const isAdmin = require('../middleware/isAdmin');
const userAuthorization = require('../middleware/userAuthorization');
const verifyToken = require('../middleware/verifyToken');

router.post('/add-user', checkUserExists, addUser);
router.post('/login', userLogin);
router.put('/profile', verifyToken, updateUserProfile);
router.put('/admin/update-user/:userId', verifyToken, isAdmin, userAuthorization, updateUserByAdmin);
router.delete('/admin/delete-user/:userId', verifyToken, isAdmin, userAuthorization, deleteUserByAdmin);

module.exports = router;
