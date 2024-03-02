const User = require('../models/User'); // Make sure this path is correct.
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registration handler
exports.register = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(409).json({ message: 'Email already in use' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create a new user instance
        const newUser = new User({
            email,
            password: hashedPassword
        });

        // Save the new user to the database
        const user = await newUser.save();

        // Respond with the new user (excluding the password)
        res.status(201).json({
            userId: user._id,
            email: user.email
            // You can add other user fields you want to return here
        });
    } catch (error) {
        res.status(500).json({ message: 'Error registering new user', error: error.message });
    }
};

// Login handler
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create a JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // or another duration appropriate for your app
        );

        // Respond with token
        res.json({ token, userId: user._id });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};

// Logout handler
exports.logout = (req, res) => {
    // Since JWTs are stateless, there's no need to handle anything on the server for logout.
    // Just instruct the client to delete the stored token.
    res.status(200).send({ message: 'Logout successful' });
};
