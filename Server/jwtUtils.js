const jwt = require('jsonwebtoken');

// Generate JWT token
function generateToken(user) {
    const payload = {
        userId: user._id,
        email: user.email,
    };
    const token=  jwt.sign(payload, '007', { expiresIn: '6d' }); 
    return token;
}

// Verify JWT token
function verifyToken(token) {
    return jwt.verify(token, '007'); 
}

function tokenDecoder(token){
    return jwt.decode(token, '007'); 
}
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    jwt.verify(token, '007', (err, user) => { 
        if (err) {
            return res.status(403).json({ error: 'Forbidden: Invalid token' });
        }
        req.user = user; // Attach the decoded user data to the request object
        next();
    });
}

module.exports = { generateToken, verifyToken, tokenDecoder, authenticateToken };
