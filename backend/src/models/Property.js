// models/Property.js
const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  propertyType: { type: String, required: true },
  state: { type: String, required: true },
  district: { type: String, required: true },
  municipality: { type: String, required: true }, // Existing field
  location: { type: String, required: true },
  area: { type: String, required: true },
  price: { type: String, required: true },
  images: [{ type: String }], // Array of image URLs
  image360: { type: String }, // URL of 360-degree image
  propertyPapers: { type: String }, // URL of the document image
  description: { type: String, required: true },
  featurePhoto: { type: String }, // Field for the feature photo
  // Add any additional fields you might need
});

const Property = mongoose.model('Property', propertySchema);

module.exports = Property;
