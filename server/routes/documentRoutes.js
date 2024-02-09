const express = require('express');
const docRouter = express.Router();
const {uploadDocument, getAllDocuments, getDocumentsByUsername} = require('../controllers/documentController');
// Login endpoint
docRouter.post('/upload', uploadDocument);

// Endpoint for adding a user
docRouter.get('/fetchAll', getAllDocuments);

docRouter.get('/byOwner', getDocumentsByUsername);

module.exports = docRouter;