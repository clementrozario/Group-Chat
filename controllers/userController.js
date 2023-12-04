const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function isStringInvalid(string) {
    return string === undefined || string.length === 0;
}

const signup = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        if (isStringInvalid(name) || isStringInvalid(email) || isStringInvalid(phone) || isStringInvalid(password)) {
            return res.status(400).json({ err: "Bad parameters. Something is missing" });
        }

        const userExists = await User.findOne({ where: { email } });

        if (userExists) {
            return res.status(409).json({ err: "User already exists. Please Login" });
        }

        const saltrounds = 10;
        const hash = await bcrypt.hash(password, saltrounds);

        await User.create({ name, email, phone, password: hash });

        res.status(201).json({ message: 'Successfully created a new user' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Internal Server Error' });
    }
};

const generateAccessToken = (id, name) => {
    return jwt.sign({ userId: id, name }, 'secretkey');
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (isStringInvalid(email) || isStringInvalid(password)) {
            return res.status(400).json({ message: 'Email or password is missing', success: false });
        }

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User does not exist' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {
            return res.status(200).json({
                success: true,
                message: "User logged in successfully",
                token: generateAccessToken(user.id, user.name),
            });
        } else {
            return res.status(401).json({ success: false, message: 'Password is incorrect' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error', success: false });
    }
};

module.exports = {
    signup,
    login,
    generateAccessToken,
};
