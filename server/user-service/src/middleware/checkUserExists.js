const User = require('../models/User');
const { getAsync } = require('../redisClient');

const checkUserExists = async (req, res, next) => {
    const { username, email } = req.body;

    // Check cache first
    const cacheUsername = await getAsync(`username:${username}`);
    const cacheEmail = await getAsync(`email:${email}`);
    if (cacheUsername || cacheEmail) {
        return res.status(400).send({ message: 'Username or email already exists.' });
    }

    // Check database
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
        // Add to cache to speed up future checks
        client.setex(`username:${username}`, 3600, 'true');
        client.setex(`email:${email}`, 3600, 'true');
        return res.status(400).send({ message: 'Username or email already exists.' });
    }

    next();
};
