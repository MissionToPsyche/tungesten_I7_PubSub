const User = require('../models/User');
const bcrypt = require('bcrypt');
const { publishLog } = require("kafka");
const { signToken } = require("auth");

const DEFAULT_SEARCH_LIMIT = 10;
const MAX_SEARCH_LIMIT = 50;
const allowedSortFields = ['username', 'name', 'email', 'createdAt'];

async function userLogin(req, res) {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({
            $or: [
                { username: username },
                { email: username }
            ]
        });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = signToken(user._id, user.role, req);
        // Send the token in the response headers
        res.header('Authorization', `Bearer ${token}`);

        // Return user details in the response body. Exclude sensitive information like the password.
        const userDetails = {
            username: user.username,
            name: user.name,
            email: user.email,
            role: user.role,
            profile: user.profilePictureUrl || `${process.env.AWS_PROFILE_PICTURE_S3_URL}default-profile.png`
        };
        res.json(userDetails);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function searchUser(req, res) {
    let { user, limit } = req.query;
    if (typeof user !== 'string') {
        return res.status(400).send("Invalid search query");
    }
    query = user.trim();

    // Validate and sanitize limit
    limit = parseInt(limit, 10) || DEFAULT_SEARCH_LIMIT;
    if (limit < 1 || limit > MAX_SEARCH_LIMIT) {
        return res.status(400).send(`Limit must be between 1 and ${MAX_SEARCH_LIMIT}`);
    }
    try {
        const results = await User.fuzzySearch(query).limit(limit).select('-_id -password -__v -teams -role -createdAt');
        res.json(results);
    } catch (error) {
        res.status(500).send("Error performing search");
    }
}


module.exports = { userLogin, searchUser, getAllUsers, getUserByUsername }