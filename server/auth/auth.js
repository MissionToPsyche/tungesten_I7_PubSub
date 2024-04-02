const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET;

exports.signToken = (userId, role, req, expiresIn = '7d') => {
    const payload = {
        userId: userId,
        role: role,
        fingerprint: generateFingerprint(req)
    };
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

exports.verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        console.error("Token verification failed:", error);
        throw error;
    }
};

const generateFingerprint = (req) => {
    const userAgent = req.headers['user-agent'];
    const ip = req.ip;
    return hashFunction(userAgent + ip);
};

const hashFunction = (input) => {
    return crypto.createHash('sha256').update(input).digest('hex');
};

exports.authenticate = (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: "Token not provided" });
    }

    try {
        const payload = this.verifyToken(token);
        const currentFingerprint = generateFingerprint(req);
        if (payload.fingerprint !== currentFingerprint) {
            return res.status(403).json({ message: "User not authorized" });
        }
        if (!req.user) req.user = {};
        req.user.userId = payload.userId;
        req.user.id = payload.userId;
        req.user.role = payload.role;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token or token payload", error: error.toString() });
    }
};
