const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.authenticate = (req, res, next) => {
    try {
        const token = req.header('Authorization');
        if (!token) {
            return res.status(401).json({ success: false, message: 'Token not provided' });
        }

        const user = jwt.verify(token, 'secret');
        User.findByPk(user.userId)
            .then(user => {
                if (!user) {
                    return res.status(401).json({ success: false, message: 'User not found' });
                }
                req.user = user;
                next();
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ success: false, message: 'Internal Server Error' });
            });
    } catch (err) {
        console.log(err);
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }
};
