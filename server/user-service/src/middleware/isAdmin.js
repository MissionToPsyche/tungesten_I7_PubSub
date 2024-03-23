const User = require('../models/User');

const isAdmin = async (req, res, next) => {
    if (!req.user) {
        return res.status(403).send({ message: 'This action requires admin privileges.' });
    }
    const user = await User.findById(req.user.id);
    if (user && user.role === 'admin') {
        next();
    } else {
        return res.status(403).send({ message: 'This action requires admin privileges.' });
    }
};

module.exports = isAdmin