const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateToken = (id, name) => {
    return jwt.sign({ userId: id, name: name }, 'secret');
};

exports.signupUser = async (req, res, next) => {
    try {
        const { name, email, phone, password } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ where: { email: email } });

        if (existingUser) {
            return res.status(409).json({ message: "User Already Exists!" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = await User.create({
            name: name,
            email: email,
            phone: phone,
            password: hashedPassword
        });

        // You can customize the response or add additional logic here if needed

        res.status(201).json({ message: "User Signup Successfully!" });
    } catch (err) {
        console.error('Error:', err);

        // Return a generic error message to the client
        res.status(500).json({ message: "Internal Server Error" });
    }
};


exports.loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email: email } });

        if (!user) {
            return res.json({ success: false, message: "User Not Found" });
        }

        bcrypt.compare(password, user.password, (err, response) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Something went wrong" });
            }

            if (response === true) {
                const token = generateToken(user.id, user.name);
                return res.status(200).json({
                    success: true,
                    message: "Login Successfully",
                    userId: user.id,
                    token: token
                });
            } else {
                return res.json({ success: false, message: "Password is incorrect" });
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
};
