const jwt = require('jsonwebtoken');

// Generate JWT token
function generateToken(user) {
    const payload = Object.assign({}, user.toObject());
    const token=  jwt.sign(payload, '007', { expiresIn: '1h' }); 
    return token;
}

// Verify JWT token
function verifyToken(token) {
    return jwt.verify(token, '007'); 
}

function tokenDecoder(token){
    return jwt.verify(token, '007'); 
}
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    jwt.verify(token, '007', (err, user) => { // Replace 'your_secret_key' with your actual secret key
        if (err) {
            return res.status(403).json({ error: 'Forbidden: Invalid token' });
        }
        req.user = user;
        next();
    });
}

module.exports = { generateToken, verifyToken, tokenDecoder, authenticateToken };
