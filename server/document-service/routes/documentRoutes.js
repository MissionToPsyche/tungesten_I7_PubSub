const express = require('express');
const router = express.Router();
const importModules = require('import-modules');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const moduleFolders = [
    'controllers',
]

moduleFolders.forEach(folder => {
    importModules(folder)
});

router.post('/upload-document', upload.single('document'), uploadDocument);
router.get('/get-document', getDocument);
module.exports = router; 