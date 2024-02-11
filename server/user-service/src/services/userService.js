const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { client } = require('../redisClient');

// Adds a new user to the system
async function addUser(req, res) {
    try {
        const { username, password, email } = req.body;

        const newUser = new User({ username, password, email });
        await newUser.save();

        // Cache the new username and email to speed up future checks
        client.setex(`username:${username}`, 3600, 'true');
        client.setex(`email:${email}`, 3600, 'true');

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Authenticates a user and returns a JWT
async function userLogin(req, res) {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Updates the user's profile, excluding username and email
async function updateUserProfile(req, res) {
    const { userId } = req.params;
    const { password, profilePicture } = req.body;
    try {
        const updates = {};
        if (password) {
            updates.password = await bcrypt.hash(password, 10);
        }
        if (profilePicture) {
            updates.profilePicture = profilePicture;
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true }).select('-password');
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Admin functionality to update any user's details
async function updateUserByAdmin(req, res) {
    const { userId } = req.params;
    const updates = req.body; // Assuming this doesn't include sensitive fields like password directly

    try {
        const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true }).select('-password');
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User updated successfully by admin', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Admin functionality to delete a user
async function deleteUserByAdmin(req, res) {
    const { userId } = req.params;

    try {
        await User.findByIdAndDelete(userId);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    addUser,
    userLogin,
    updateUserProfile,
    updateUserByAdmin,
    deleteUserByAdmin,
};
