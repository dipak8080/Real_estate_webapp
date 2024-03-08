const mongoose = require('mongoose');

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
  description: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
  featurePhoto: {
    type: String,
  },
  video: {
    type: String,
  },
  isArchived: { // Add this field to support archiving functionality
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

const Property = mongoose.model('Property', propertySchema);

module.exports = Property;
