// src/controllers/propertyController.js
const Property = require('../models/Property');

// Function to handle the creation of a property
const createProperty = async (req, res) => {
  try {
    const { propertyType, state, district, municipality, location, area, price, description } = req.body;
    
    // Adjusting to save only filenames for images, image360, propertyPapers, and featurePhoto
    const images = req.files['images'] ? req.files['images'].map(file => file.filename) : [];
    const image360 = req.files['image360'] ? req.files['image360'][0].filename : '';
    const propertyPapers = req.files['propertyPapers'] ? req.files['propertyPapers'][0].filename : '';
    const featurePhoto = req.files['featurePhoto'] ? req.files['featurePhoto'][0].filename : null;

    const property = new Property({
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
      featurePhoto, // Saving only the filename for the featurePhoto
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

module.exports = {
  createProperty,
  listProperties
};
