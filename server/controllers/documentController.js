const { Document, Comment } = require('../model/documentSchema');

const AWS = require('aws-sdk');
const bucketName = process.env.AWS_BUCKET_NAME;
AWS.config.update({
  accessKeyId: 'AKIA2PZWP33FERNV4W54',
  secretAccessKey: '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',
  region: 'us-west-2'
});
const s3 = new AWS.S3();

const uploadDocumentToS3 = async (req, res) => {
  try {
    const file = req.file; // Assuming file is available in req.file (use multer for file handling)
    const s3Result = await s3.upload({
      Bucket: bucketName,
      Key: `${Date.now()}_${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    }).promise();

    // Save document metadata in your DB, including the S3 object key and URL
    const newDocument = new Document({
      title: req.body.title,
      author: req.body.ownerUsername, // Adjust according to your schema
      content: s3Result.Location, // URL of the uploaded file
      metadata: { s3Key: s3Result.Key } // Storing S3 object key for future reference
    });
    await newDocument.save();

    res.status(201).json({ message: 'Document uploaded successfully', document: newDocument });
  } catch (error) {
    res.status(500).json({ message: 'Failed to upload document', error: error.message });
  }
};

// Function to retrieve a document from S3
const getDocumentFromS3 = async (req, res) => {
  try {
    const documentId = req.params.id;
    const document = await Document.findById(documentId);
    if (!document) return res.status(404).json({ message: 'Document not found' });

    const s3Object = await s3.getObject({ Bucket: bucketName, Key: document.metadata.s3Key }).promise();

    // For simplicity, sending the file directly in the response. For larger files, consider streaming.
    res.send(s3Object.Body);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve document', error: error.message });
  }
};

const uploadDocument = async (req, res) => {
  try {
    const { title, content, ownerUsername } = req.body;
    // Validity check to see if the document title already exists
    const existingDocument = await Document.findOne({ title });
    if (existingDocument) {
      return res.status(400).json({ error: 'A Document already exists with the same title.' });
    }
    const newDocument = new Document({ title, content, metadata: { ownerUsername } });
    if (req.file) { // Assuming file is attached to req via middleware like multer
      const fileUploadResult = await uploadFileToS3(req.file);
      newDocument.fileUrl = fileUploadResult.Location; // Store the URL of the uploaded file
    }
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

module.exports = { uploadDocument, getAllDocuments, getDocumentsByUsername, postNewCommentOnTheDocument, getCommentsForDocument, uploadDocumentToS3, getDocumentFromS3 };