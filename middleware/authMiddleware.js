const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authenticate = (req, res, next) => {
    try {
        const token = req.header('Authorization');
        const user = jwt.verify(token, 'secretkey');
        User.findByPk(user.userId).then(user => {
            req.user = user;
            next();
        });
    } catch (err) {
        console.error(err);
        return res.status(401).json({ success: false });
    }
};

module.exports = {
    authenticate,
};
