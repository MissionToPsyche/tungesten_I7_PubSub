const User = require('../models/User');

const isAdmin = async (req, res, next) => {
    const user = await User.findById(req.user.id);
    if (user && user.role === 'admin') {
        next();
    } else {
        return res.status(403).send({ message: 'This action requires admin privileges.' });
    }
};
