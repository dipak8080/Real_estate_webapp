import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Viewer } from '@photo-sphere-viewer/core';
import '@photo-sphere-viewer/core/index.css';

import './PropertyDetailsPage.css';

function PropertyDetailsPage() {
  const [propertyDetails, setPropertyDetails] = useState(null);
  const [modalImage, setModalImage] = useState(null); // For handling modal image popups
  const { id } = useParams();
  const baseUrl = 'http://localhost:5000/uploads/';

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/properties/${id}`);
        setPropertyDetails(response.data);
      } catch (error) {
        console.error('Error fetching property details:', error);
      }
    };

    fetchPropertyDetails();
  }, [id]);

  useEffect(() => {
    // This effect handles the initialization of the 360-degree image viewer
    if (propertyDetails && propertyDetails.image360) {
      const viewer = new Viewer({
        container: document.querySelector('#viewer360'),
        panorama: `${baseUrl}${propertyDetails.image360}`
        // Add other Viewer options as needed
      });

      // Cleanup function to destroy the viewer when the component unmounts or when the image changes
      return () => viewer.destroy();
    }
  }, [propertyDetails, baseUrl]);

  const openModal = (imagePath) => {
    setModalImage(`${baseUrl}${imagePath}`);
    // Optionally, handle modal display here if not using CSS for showing/hiding
  };

  const closeModal = () => {
    setModalImage(null);
    // Optionally, handle modal hiding here if not using CSS for showing/hiding
  };

  if (!propertyDetails) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="property-details-container">
        {/* Property Images Section */}
        <div className="gallery-section">
          <h2>Property Images</h2>
          <div className="gallery-container">
            {propertyDetails.images.map((image, index) => (
              <div className="gallery-item" key={index} onClick={() => openModal(image)}>
                <img src={`${baseUrl}${image}`} alt={`Property ${index}`} />
              </div>
            ))}
          </div>
        </div>

    {/* Property Papers Section */}
<div className="gallery-section">
  <h2>Property Papers</h2>
  <div className="papers-container">
    {propertyDetails.propertyPapers && propertyDetails.propertyPapers.map((paper, index) => (
      <div className="gallery-item" key={index} onClick={() => openModal(paper)}>
        <img src={`${baseUrl}${paper}`} alt={`Property paper ${index}`} />
      </div>
    ))}
  </div>
</div>

{/* Video Section */}
{propertyDetails.video && (
  <div className="gallery-section">
    <h2>Property Video</h2>
    <video width="500" height="300" controls>
      <source src={`${baseUrl}${propertyDetails.video}`} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  </div>
)}

        {/* 360 Image Section */}
        {propertyDetails.image360 && (
          <div className="gallery-section">
            <h2>360° Image</h2>
            <div id="viewer360" style={{ width: '500px', height: '500px' }}></div>
          </div>
        )}

        {/* Contact Details Section */}
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

      {/* Modal Popup */}
      {modalImage && (
        <div className="modal" onClick={closeModal}>
          <span className="close" onClick={closeModal}>&times;</span>
          <div className="modal-content">
            <img src={modalImage} alt="Expanded view" />
          </div>
        </div>
      )}
    </>
  );
}

export default PropertyDetailsPage;
