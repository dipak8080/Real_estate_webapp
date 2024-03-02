import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './PropertyDetailsPage.css';

function PropertyDetailsPage() {
  const [propertyDetails, setPropertyDetails] = useState(null);
  const { id } = useParams(); // Assuming you're using React Router v5 or v6

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const response = await axios.get(`/api/properties/${id}`);
        setPropertyDetails(response.data);
      } catch (error) {
        console.error('Error fetching property details:', error);
      }
    };

    fetchPropertyDetails();
  }, [id]);

  if (!propertyDetails) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="property-details-container">
        <div className="gallery">
          <div className="photo-gallery">
            {/* Image carousel would go here. For demonstration, let's assume it's not dynamically generated yet */}
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
            <p>State: {propertyDetails.state}</p>
            <p>District: {propertyDetails.district}</p>
            <p>Location: {propertyDetails.location}</p>
            <p>Area: {propertyDetails.area}</p>
            <p>Price: {propertyDetails.price}</p>
            <p>Description: {propertyDetails.description}</p>
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
