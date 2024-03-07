const mongoose = require('mongoose');

// Define the schema for the property
const propertySchema = new mongoose.Schema({
  propertyType: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  municipality: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  area: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  images: [{
    type: String,
  }],
  image360: [{
    type: String,
  }],
  propertyPapers: [{
    type: String,
  }],
  video: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  featurePhoto: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
  },
}, {
  timestamps: true,
});

// Create the model from the schema
const Property = mongoose.model('Property', propertySchema);

// Export the model
module.exports = Property;
