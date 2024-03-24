const express = require('express');
const router = express.Router();
const { authenticate } = require('auth');
const importModules = require('import-modules');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const moduleFolders = [
    'controllers',
    'middleware',
    'validators'
]

moduleFolders.forEach(folder => {
    importModules(folder)
});

router.post('/admin/add-user', authenticate, checkUserExists, addNewUserValidator, runValidation, addUser);
router.post('/admin/delete-user', deleteUserByAdmin);
router.post('/login', userLogin);
router.put('/admin/update-user', updateUserByAdmin)
router.put('/update-user', updatePofileValidator, upload.single('profilePicture'), updateUserProfile);
router.get('/search', searchUser)
router.get('/get-all-users', getAllUsers)
router.post('/admin/add-team', createTeam)
router.post('/admin/update-team', updateTeam)
router.post('/admin/delete-team', deleteTeam)
router.get('/get-team', getTeam)
module.exports = router;