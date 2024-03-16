const express = require('express');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const docRouter = express.Router();
const { uploadDocument, getAllDocuments, getDocumentsByUsername, postNewCommentOnTheDocument, getCommentsForDocument } = require('../controllers/documentController');
// Login endpoint
docRouter.post('/upload', upload.single('file'), uploadDocument);

// Endpoint for adding a user
docRouter.get('/fetchAll', getAllDocuments);

docRouter.get('/byOwner', getDocumentsByUsername);

docRouter.post('/documents/:id/comments', postNewCommentOnTheDocument);

docRouter.get('/documents/:id/comments', getCommentsForDocument);

module.exports = docRouter;