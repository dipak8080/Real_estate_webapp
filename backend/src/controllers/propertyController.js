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
      video, // Add the video filename to the property object
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
    const properties = await Property.find();
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






module.exports = {
  createProperty,
  listProperties,
  getPropertyDetails, // Exporting the new function
};  