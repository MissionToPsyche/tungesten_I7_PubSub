const { body } = require('express-validator');

exports.addNewUserValidator = [
    body('username')
        .not()
        .isEmpty()
        .withMessage('Username is required'),
    body('name')
        .not()
        .isEmpty()
        .withMessage('Name is required'),
    body('password')
        .isLength({ min: 8 })
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).+$/)
        .withMessage('Password must be at least 8 characters long and contain at least 1 Uppercase and 1 Lowercase'),
    body('email')
        .isEmail()
        .withMessage('Must be a valid email address'),
    body('role')
        .not()
        .isEmpty()
        .isIn(['admin', 'user', 'researcher'])
        .withMessage('User role is required'),
];

exports.userLoginValidator = [
    body('password')
        .isLength({ min: 8 })
        .withMessage('Invalid credentials')
];

exports.forgotPasswordValidator = [
    body('email')
        .isEmail()
        .withMessage('Must be a valid email address'),
];

exports.resetPasswordValidator = [
    body('newPassword')
        .isLength({ min: 8 })
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d]/)
        .withMessage('Password must be at least 8 characters long and contain at least 1 Uppercase, 1 lowercase, and 1 digit'),
    body('resetPasswordLink')
        .not()
        .isEmpty()
        .withMessage('Token is required')
];

exports.updatePofileValidator = [
    body('oldPassword')
        .isLength({ min: 8 })
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).+$/)
        .withMessage('Old Password must be at least 8 characters long and contain at least 1 Uppercase, 1 lowercase, and 1 digit'),
    body('newPassword')
        .isLength({ min: 8 })
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).+$/)
        .withMessage('New Password must be at least 8 characters long and contain at least 1 Uppercase, 1 lowercase, and 1 digit'),
    body('resetPasswordLink')
        .not()
        .isEmpty()
        .withMessage('Token is required')
];