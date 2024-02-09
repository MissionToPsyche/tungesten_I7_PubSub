const verifyToken = (req, res, next) => {
    const publicPaths = ['/login', '/add-user', '/public-data']; // Define public paths that don't require JWT verification
    if (publicPaths.includes(req.path)) {
        return next(); // Skip JWT verification for public paths
    }

    // JWT verification logic for protected paths
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1]; // Get the token from the header
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ message: "Token is not valid" });
            }
            req.user = user; // Add the user payload to the request
            next(); // Proceed to the next middleware or route handler
        });
    } else {
        res.status(401).json({ message: "Authorization header is missing" });
    }
};
