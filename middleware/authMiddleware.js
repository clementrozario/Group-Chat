const jwt = require('jsonwebtoken')
const User = require('../models/userModel');

exports.authenticate = (req, res, next) => {
    try {
        const token = req.header('Authorization');
        const user = jwt.verify(token, 'secret')
        User.findByPk(user.userId)
        .then(user => {
            // console.log(JSON.stringify(user));
            req.user = user;
            next();
        }).catch (err => {
            console.log(err)})
    } catch(err) {
        console.log(err);
        return res.status(401).json({success: false})
    }
}