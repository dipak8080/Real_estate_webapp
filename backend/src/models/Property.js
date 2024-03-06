// models/Property.js
const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  propertyType: { type: String, required: true },
  state: { type: String, required: true },
  district: { type: String, required: true },
  municipality: { type: String, required: true }, 
  location: { type: String, required: true },
  area: { type: String, required: true },
  price: { type: String, required: true },
  images: [{ type: String }], 
  image360: [{ type: String }], 
  propertyPapers: [{ type: String }], 
  video: { type: String }, 
  description: { type: String, required: true },
  featurePhoto: { type: String }, 
  
});

const Property = mongoose.model('Property', propertySchema);

module.exports = Property;