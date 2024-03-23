require('dotenv').config(); // Make sure to load the environment variables
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User'); // Make sure this is the correct path to your User model

// Connect to MongoDB using the connection string from your .env file
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

const createAdmin = async () => {
    try {
      const existingAdmin = await User.findOne({ email: 'admindipak@gmail.com' });
      if (existingAdmin) {
        console.log('Admin user already exists');
        return;
      }
  
      const hashedPassword = await bcrypt.hash('dipak', 12);
  
      // Create a new admin user
      const admin = new User({
        fullName: 'Admin Dipak',
        email: 'admindipak@gmail.com',
        password: hashedPassword,
        isAdmin: true,
        phone: '9814790442', 
        location: 'lalitpur' 
      });
  
      await admin.save();
      console.log('Admin user created successfully');
    } catch (error) {
      console.error('Error creating admin user:', error);
    } finally {
      mongoose.connection.close();
    }
  };
  

// Call the function to create an admin user
createAdmin();
