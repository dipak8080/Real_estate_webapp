const mongoose = require('mongoose');
const Property = require('../models/Property');

// Function to handle the creation of a property
const createProperty = async (req, res) => {
  try {
    const { propertyType, state, district, municipality, location, area, price, description, userId = req.user._id } = req.body;
    
    const images = req.files['images'] ? req.files['images'].map(file => file.filename) : [];
    const image360 = req.files['image360'] ? req.files['image360'].map(file => file.filename) : [];
    const propertyPapers = req.files['propertyPapers'] ? req.files['propertyPapers'].map(file => file.filename) : [];
    const featurePhoto = req.files['featurePhoto'] ? req.files['featurePhoto'][0].filename : null;
    const video = req.files['video'] ? req.files['video'][0].filename : '';

    const property = new Property({
      userId,
      propertyType,
      state,
      district,
      municipality,
      location,
      area,
      price,
      description,
      images,
      image360,
      propertyPapers,
      featurePhoto,
      video, 
    });

    await property.save();
    res.status(201).json(property);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Function to list all properties
const listProperties = async (req, res) => {
  try {
    // Adjust this line to exclude archived properties from the results
    const properties = await Property.find({ isArchived: false });
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Function to get details of a single property by ID
const getPropertyDetails = async (req, res) => {
  try {
    // Retrieve the property by ID and populate the user details
    const property = await Property.findById(req.params.id).populate('userId');
    
    // This is where you log the property to see if the user details are populated
    console.log('Retrieved property with user populated:', property);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    // Send the populated property as the response
    res.json(property);
  } catch (error) {
    console.error('Error fetching property details:', error);
    res.status(500).json({ message: error.message });
  }
};



// Function to archive a property
const archiveProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, { isArchived: true }, { new: true });
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Function to unarchive a property
const unarchiveProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, { isArchived: false }, { new: true });
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Function to delete a property
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const listAllPropertiesForOwner = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID.' });
    }

    const properties = await Property.find({ userId: userId });
    res.status(200).json(properties);
  } catch (error) {
    console.error('Server error in listAllPropertiesForOwner:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



// Function to search properties with filters
const searchProperties = async (req, res) => {
  try {
    const { district, location, price, propertyType } = req.query;

    // Set up the base query object
    let query = { isArchived: false };

    // Add district to query if it exists
    if (district) {
      query.district = new RegExp(district, 'i');
    }

    // Add location to query if it exists
    if (location) {
      query.location = new RegExp(location, 'i');
    }

    // Add property type to query if it exists
    if (propertyType) {
      query.propertyType = new RegExp(`^${propertyType}`, 'i');
    }

    // Add price range to query if price is specified
    if (price) {
      const priceAsNumber = Number(price);
      const priceRange = 5000; // Define the range for price flexibility
      query.price = {
        $gte: priceAsNumber - priceRange,
        $lte: priceAsNumber + priceRange
      };
    }

    // Find properties using the constructed query object
    const properties = await Property.find(query);
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



module.exports = {
  createProperty,
  listProperties,
  getPropertyDetails,
  archiveProperty,
  unarchiveProperty,
  deleteProperty,
  listAllPropertiesForOwner,
  searchProperties,
};




 