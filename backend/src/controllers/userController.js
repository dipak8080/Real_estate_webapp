const User = require('../models/User'); // Make sure this path is correct.
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registration handler
exports.register = async (req, res) => {
    try {
        // Destructure all fields from req.body
        const { fullName, email, phone, location, password } = req.body;

        // Check if the user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(409).json({ message: 'Email already in use' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create a new user instance
        const newUser = new User({
            fullName, // included from req.body
            email,    // included from req.body
            phone,    // included from req.body
            location, // included from req.body
            password: hashedPassword // hashed password
        });

        // Save the new user to the database
        const user = await newUser.save();

        // Respond with the new user (excluding the password)
        res.status(201).json({
            userId: user._id,
            fullName: user.fullName, // Include the fullName in the response
            email: user.email,
            phone: user.phone,       // Include the phone in the response
            location: user.location  // Include the location in the response
        });
    } catch (error) {
        res.status(500).json({ message: 'Error registering new user', error: error.message });
    }
};

// In your login handler
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
            { expiresIn: '1h' } // Adjust the duration as needed
        );

        // Respond with token and isAdmin status
        res.json({
            token: token, // Token generated for the user
            isAdmin: user.isAdmin, // Include the isAdmin flag in the response
            userId: user._id // Send the user ID to the client
        });
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




// Function to handle fetching user profile data
exports.getUserProfile = async (req, res) => {
    try {
        // Assuming you've verified and decoded the token and attached the user ID to req.user
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Respond with the user data, excluding the password
        res.json({
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            location: user.location
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user profile', error: error.message });
    }
};

// Update profile handler
exports.updateProfile = async (req, res) => {
    console.log("Fetching user profile for ID:", req.user._id);
    try {
        const userId = req.user._id; // Assuming you're getting user ID from the token
        const { fullName, location, phone } = req.body;

        const user = await User.findByIdAndUpdate(userId, {
            fullName,
            location,
            phone
        }, { new: true }); // { new: true } option returns the document after update

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            userId: user._id,
            email: user.email,
            fullName: user.fullName,
            location: user.location,
            phone: user.phone
            // Add any other fields you wish to return
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
};

// Function to upgrade a user to an admin - Should be protected and only accessible by super-admins
exports.makeAdmin = async (req, res) => {
    try {
        const { userId } = req.params;
        const updatedUser = await User.findByIdAndUpdate(userId, { isAdmin: true }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({
            message: 'User has been made an admin',
            user: {
                userId: updatedUser._id,
                fullName: updatedUser.fullName,
                isAdmin: updatedUser.isAdmin,
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user to admin', error: error.message });
    }
};