const express = require('express');
const docRouter = express.Router();
const {uploadDocument, getAllDocuments, getDocumentsByUsername} = require('../controllers/documentController');
// Login endpoint
docRouter.post('/upload', uploadDocument);

// Endpoint for adding a user
docRouter.post('/fetchAll', getAllDocuments);

docRouter.post('/byOwner', getDocumentsByUsername);

module.exports = docRouter;