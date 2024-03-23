const User = require('../models/User');

const checkUserExists = async (req, res, next) => {
    const { username, email } = req.body;
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
        return res.status(400).send({ message: 'Username or email already exists.' });
    }
    if (typeof next === 'function') {
        next();
    }
    else {
        return res.status(200).send({ message: 'User doesn\'t exists.' });
    }
};

module.exports = checkUserExists