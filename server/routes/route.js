const express = require('express');
const router = express.Router();
const { userLogin, addUser } = require('../controllers/authController');
const { decryptRequest } = require('../middleware/encryptionMiddleware');
const verifyToken = require('../middleware/verifyToken');

// Public routes
router.post('/login', userLogin);
router.post('/add-user', addUser);

// Apply JWT verification middleware to all routes below this line
router.use(verifyToken);

// Example of a protected route
router.get('/protected-route', decryptRequest, (req, res) => {
    res.json({ message: "You have access to the protected route", user: req.user });
});

const documentController = require('../controllers/documentController');

router.post('/upload-document', documentController.uploadDocument);

router.get('/document-diff/:versionId1/:versionId2', documentController.getDocumentDiff);


module.exports = router;
