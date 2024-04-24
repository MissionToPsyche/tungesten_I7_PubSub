const express = require("express");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./files");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + file.originalname);
  },
});
const upload = multer({ storage: storage });
const docRouter = express.Router();
const {
  uploadDocument,
  getAllDocuments,
  getDocumentsByUsername,
  postNewCommentOnTheDocument,
  getCommentsForDocument,
  getDocument,
  cTextDocument,
  shareDocument,
} = require("../controllers/documentController");
// Login endpoint
docRouter.post("/upload", upload.single("file"), uploadDocument);

docRouter.post("/create-text-document", cTextDocument);

// Endpoint for fetching all documents
docRouter.get("/fetchAll", getAllDocuments);

docRouter.get("/byOwner", getDocumentsByUsername);

docRouter.post("/documents/:id/comments", postNewCommentOnTheDocument);

docRouter.get("/documents/:id/comments", getCommentsForDocument);

// Endpoint for opening document
docRouter.get("/documents/:id", getDocument);

docRouter.post("/share/:documentId", shareDocument);

module.exports = docRouter;
