const Document = require('../models/documentSchema');
const DocumentVersion = require('../models/documentVersionSchema');
const upload = require('../config/uploadConfig');

// Upload document endpoint
exports.uploadDocument = upload.single('documentFile'), async (req, res) => {
    try {
        const { title, authorId, abstract, keywords, documentType, changelog } = req.body;
        const contentUrl = req.file.location; // URL from multer-s3 storage

        // Find or create the document
        let document = await Document.findOne({ title: title, author: authorId });
        if (!document) {
            document = new Document({
                title,
                author: authorId,
                abstract,
                keywords: keywords.split(','), // Assuming keywords are sent as a comma-separated string
                documentType,
                // Initialize with empty accessControls if necessary
            });
        }

        // Create a new document version
        const versionNumber = document.versions.length + 1;
        const newVersion = new DocumentVersion({
            document: document._id,
            versionNumber,
            contentUrl,
            changelog,
        });
        await newVersion.save();

        // Update document's versions array
        document.versions.push(newVersion._id);
        await document.save();

        res.status(201).json({ message: 'Document uploaded successfully', document, newVersion });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const diff = require('diff');
const DocumentVersion = require('../models/documentVersionSchema');

exports.getDocumentDiff = async (req, res) => {
    try {
        const { versionId1, versionId2 } = req.params; // IDs of the document versions to compare

        // Fetch document versions
        const version1 = await DocumentVersion.findById(versionId1);
        const version2 = await DocumentVersion.findById(versionId2);

        if (!version1 || !version2) {
            return res.status(404).json({ message: "One or both document versions not found" });
        }

        // Assuming `getContent` is a function that fetches the document content from your storage
        const content1 = await getContent(version1.contentUrl);
        const content2 = await getContent(version2.contentUrl);

        // Calculate diff
        const documentDiff = diff.createTwoFilesPatch('Version ' + version1.versionNumber, 'Version ' + version2.versionNumber, content1, content2, '', '', { context: 5 });

        res.json({ diff: documentDiff });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

async function getContent(url) {
    // This function should fetch the document content from wherever it's stored.
    // For simplicity, this is just a placeholder.
    return "Document content based on the URL";
}
