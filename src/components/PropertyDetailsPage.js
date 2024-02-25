import React from 'react';
import './PropertyDetailsPage.css';

function PropertyDetailsPage() {
  // Placeholder data
  const propertyDetails = {
    userName: 'John Doe',
    phoneNumber: '123-456-7890',
    state: 'State Name',
    district: 'District Name',
    location: 'Location Name',
    area: '123 sq ft',
    price: '$300,000',
    description: 'This is a great property with lots of natural light...'
    
  };

  return (
    <>
      
      <div className="property-details-container">
        <div className="gallery">
          <div className="photo-gallery">
            {/* Image carousel would go here */}
            <p>Property Photos</p>
          </div>
          <div className="video-tour">
            <p>360 Video Tour</p>
            {/* 360 video tour */}
          </div>
          <div className="property-papers">
            <p>Property Papers</p>
            {/* Links or previews to property documents */}
          </div>
        </div>
        <div className="details">
          <div className="property-info">
            <h2>Property Details</h2>
            <p>{propertyDetails.state}</p>
            <p>{propertyDetails.district}</p>
            <p>{propertyDetails.location}</p>
            <p>{propertyDetails.area}</p>
            <p>{propertyDetails.price}</p>
            <p>{propertyDetails.description}</p>
          </div>
          <div className="contact-info">
            <div className="user-name">
              <label>Name:</label>
              <div>{propertyDetails.userName}</div>
            </div>
            <div className="user-phone">
              <label>Phone:</label>
              <div>{propertyDetails.phoneNumber}</div>
            </div>
            <textarea placeholder="Write your message here"></textarea>
            <button>Send Message</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default PropertyDetailsPage;
