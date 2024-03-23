const User = require('../models/User');
const Property = require('../models/Property');

const adminController = {

 // Function to list all users for the admin dashboard
  adminListUsers: async (req, res) => {
    try {
      const users = await User.find().select('-password'); // Exclude passwords from the result
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
  },

  getUserDetails: async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user details', error: error.message });
    }
  },
  

  // Function to edit a user profile as admin
  adminEditUser: async (req, res) => {
    try {
      const { userId } = req.params;
      const updates = req.body;
      // You might want to validate the updates or exclude certain fields that shouldn't be updated directly
      const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true }).select('-password');
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({
        message: 'User updated successfully',
        user: updatedUser
      });
    } catch (error) {
      res.status(500).json({ message: 'Error updating user', error: error.message });
    }
  },

  // Function to delete a user as admin
  adminDeleteUser: async (req, res) => {
    try {
      const { userId } = req.params;
      const deletedUser = await User.findByIdAndDelete(userId);
      if (!deletedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
  },



// Function to list all properties for the admin dashboard
adminListProperties: async (req, res) => {
  try {
    // Updated to populate the 'userId' field with user details
    const properties = await Property.find().populate('userId');
    const propertiesWithUserDetails = properties.map(property => {
      return {
        ...property.toObject(),
        userFullName: property.userId.fullName // Assuming the user document has a 'fullName' field
      };
    });
    res.status(200).json(propertiesWithUserDetails);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching properties', error: error.message });
  }
},


  // Function to archive a property as admin
  adminArchiveProperty: async (req, res) => {
    try {
      const { propertyId } = req.params;
      const archivedProperty = await Property.findByIdAndUpdate(propertyId, { isArchived: true }, { new: true });
      if (!archivedProperty) {
        return res.status(404).json({ message: 'Property not found' });
      }
      res.json({
        message: 'Property archived successfully',
        property: archivedProperty
      });
    } catch (error) {
      res.status(500).json({ message: 'Error archiving property', error: error.message });
    }
  },

  // Function to unarchive a property as admin
  adminUnarchiveProperty: async (req, res) => {
    try {
      const { propertyId } = req.params;
      const unarchivedProperty = await Property.findByIdAndUpdate(propertyId, { isArchived: false }, { new: true });
      if (!unarchivedProperty) {
        return res.status(404).json({ message: 'Property not found' });
      }
      res.json({
        message: 'Property unarchived successfully',
        property: unarchivedProperty
      });
    } catch (error) {
      res.status(500).json({ message: 'Error unarchiving property', error: error.message });
    }
  },

  // Function to delete a property as admin
  adminDeleteProperty: async (req, res) => {
    try {
      const { propertyId } = req.params;
      const deletedProperty = await Property.findByIdAndDelete(propertyId);
      if (!deletedProperty) {
        return res.status(404).json({ message: 'Property not found' });
      }
      res.json({ message: 'Property deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting property', error: error.message });
    }
  },

  // Admin function to feature a property
  adminFeatureProperty: async (req, res) => {
    try {
      const { propertyId } = req.params;
      const property = await Property.findByIdAndUpdate(propertyId, { isFeatured: true }, { new: true });
      
      if (!property) {
        return res.status(404).json({ message: 'Property not found' });
      }

      res.json({
        message: 'Property featured successfully',
        property: property
      });
    } catch (error) {
      res.status(500).json({ message: 'Error featuring property', error: error.message });
    }
  },

  // Admin function to unfeature a property
  adminUnfeatureProperty: async (req, res) => {
    try {
      const { propertyId } = req.params;
      const property = await Property.findByIdAndUpdate(propertyId, { isFeatured: false }, { new: true });
      
      if (!property) {
        return res.status(404).json({ message: 'Property not found' });
      }

      res.json({
        message: 'Property unfeatured successfully',
        property: property
      });
    } catch (error) {
      res.status(500).json({ message: 'Error unfeaturing property', error: error.message });
    }
  },

};

module.exports = adminController;