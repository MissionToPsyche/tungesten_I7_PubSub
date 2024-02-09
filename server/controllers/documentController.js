const Document = require('../model/documentModel');

const uploadDocument = async (req, res) => {
    try {
      const { title, content, ownerUsername } = req.body;
      // Validity check to see if the document title already exists
      const existingDocument = await Document.findOne({ title });
      if (existingDocument) {
        return res.status(400).json({ error: 'A Document already exists with the same title.' });
      }
      const newDocument = new Document({ title, content, metadata: { ownerUsername } });
      const savedDocument = await newDocument.save();
      res.json(savedDocument);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

const getAllDocuments = () => {};

const getDocumentsByUsername = () => {};

module.exports = {uploadDocument, getAllDocuments, getDocumentsByUsername};