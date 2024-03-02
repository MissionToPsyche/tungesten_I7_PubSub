const { Document, Comment } = require('../model/documentSchema');

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

const getAllDocuments = async (req, res) => {
  try {
    const documents = await Document.find();
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getDocumentsByUsername = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ error: "Please provide the document owner's username." });
    }
    const documents = await Document.find({ 'metadata.ownerUsername': username });
    if (documents.length === 0) {
      return res.status(404).json({ error: 'No documents found for the specified owner.' });
    }
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const postNewCommentOnTheDocument = async (req, res) => {
  try {
    const { text, createdBy } = req.body;
    const documentId = req.params.id;

    // Create a new comment
    const comment = await Comment.create({ text, document: documentId, createdBy });

    // Update the document to include the new comment
    await Document.findByIdAndUpdate(documentId, { $push: { comments: comment._id } });

    res.status(201).json({ message: 'Comment added successfully', comment });
  } catch (error) {
    res.status(400).json({ message: 'Error adding comment', error: error.message });
  }
};

const getCommentsForDocument = async (req, res) => {
  try {
    const { id } = req.params; // Document ID from URL
    const comments = await Comment.find({ document: id }).populate('createdBy', 'username -_id');

    if (!comments.length) {
      return res.status(404).json({ message: 'No comments found for this document.' });
    }

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching comments', error: error.message });
  }
};

module.exports = { uploadDocument, getAllDocuments, getDocumentsByUsername, postNewCommentOnTheDocument, getCommentsForDocument };