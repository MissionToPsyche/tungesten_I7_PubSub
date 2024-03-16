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

async function getAllUsers(req, res) {
    let { page, limit, sortBy, sortOrder } = req.query;

    // Validate and sanitize page and limit
    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || DEFAULT_SEARCH_LIMIT;

    // Validate sortBy field
    if (!allowedSortFields.includes(sortBy)) {
        return res.status(400).json({ message: 'Invalid sort field.' });
    }

    // Validate sortOrder and default to ascending if invalid value is provided
    sortOrder = sortOrder === 'desc' ? -1 : 1;

    try {
        const total = await User.countDocuments();
        const totalPages = Math.ceil(total / limit);

        // Check if requested page exceeds total pages
        if (page > totalPages) {
            return res.status(400).json({ message: `Requested page exceeds the total number of pages (${totalPages}).` });
        }

        const skip = (page - 1) * limit;
        const users = await User.find()
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(limit)
            .select('-_id -__v -teams -password -createdAt');

        res.json({
            users,
            total,
            totalPages,
            currentPage: page,
            sortBy,
            sortOrder: sortOrder === 1 ? 'asc' : 'desc'
        });
    } catch (error) {
        console.error("Error fetching users with sorting:", error);
        res.status(500).send("Error fetching users");
    }
};

async function getUserByUsername(req, res) {
    const { username } = req.params;

    try {

        const user = await User.findOne({ username: username })
            .select('-password -_id -__v')
            .populate('teams', 'name');

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).send("Error fetching user");
    }
};

module.exports = { userLogin, searchUser, getAllUsers, getUserByUsername }