// controllers/userController.js
const bcrypt = require('bcrypt');
const User = require('../models/user');

async function signUp(req, res) {
  const { name, email, phone, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email: email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    return res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

module.exports = {
  signUp,
};
