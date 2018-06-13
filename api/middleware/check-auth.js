require('../config/config'); 
const jwt = require('jsonwebtoken');

exports.checkAuth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, CONFIG.jwt_encryption);
        console.log(decoded);
        req.userData = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Auth failed - checkAuth'
        });
    }
};

exports.adminAuth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, CONFIG.jwt_encryption);
        if ('admin' !== decoded.username) {
            throw new Error('Not Admin')
        }
        req.userData = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
};