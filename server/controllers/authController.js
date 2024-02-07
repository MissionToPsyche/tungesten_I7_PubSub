const User = require('../model/userModel');
const userLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).send('Authentication failed. User not found.');
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).send('Authentication failed. Wrong password.');
        }
        res.send('User logged in successfully');
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const addUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        // Checking if user already exists
        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).send('A user already exists with this username. Please choose a different username.');
        }
        // Password validation
        if (password.length < 8) {
            return res.status(400).send('Password must have at least 8 characters.');
        }
        if (!containsSpecialCharacter(password)) {
            return res.status(400).send('Password must contain at least one special character.');
        }
        if (!/[A-Z]/.test(password)) {
            return res.status(400).send('Password must contain at least one uppercase letter.');
        }
        if (!/\d/.test(password)) {
            return res.status(400).send('Password must contain at least one digit.');
        }
        const newUser = new User({
            username,
            password
        });
        await newUser.save();
        res.status(201).send('User registered successfully');
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Checking for special characters
const specialCharacters = '!@#$%^&*(),.?":{}|<>';
const containsSpecialCharacter = (key) => {
    for (const char of specialCharacters) {
        if (key.includes(char)) {
            return true;
        }
    }
    return false;
}

module.exports = {userLogin, addUser};