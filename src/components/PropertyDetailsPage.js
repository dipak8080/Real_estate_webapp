import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Viewer } from '@photo-sphere-viewer/core';
import '@photo-sphere-viewer/core/index.css';

import './PropertyDetailsPage.css';

function PropertyDetailsPage() {
  const [propertyDetails, setPropertyDetails] = useState(null);
  const [modalImage, setModalImage] = useState(null); // For handling modal image popups
  const viewersRef = useRef([]); // Ref to store the viewers
  const { id } = useParams();
  const baseUrl = 'http://localhost:5000/uploads/';

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const token = localStorage.getItem('token'); // Get the token from localStorage
        if (!token) {
          console.error('No token found');
          return;
        }
        const response = await axios.get(`http://localhost:5000/api/properties/${id}`, {
          headers: {
            Authorization: `Bearer ${token}` // Add the authorization header to the request
          }
        });
        setPropertyDetails(response.data);
      } catch (error) {
        console.error('Error fetching property details:', error);
      }
    };
    
  
    fetchPropertyDetails();
  }, [id]);

  useEffect(() => {
    // Destroy existing viewers to prevent duplicates
    viewersRef.current.forEach((viewer) => viewer.destroy());
    viewersRef.current = [];

    if (propertyDetails && propertyDetails.image360 && propertyDetails.image360.length > 0) {
      propertyDetails.image360.forEach((image360Url, index) => {
        const viewerElement = document.querySelector(`#viewer360-${index}`);
        if (!viewerElement) return; // Guard against missing elements

        const viewer = new Viewer({
          container: viewerElement,
          panorama: `${baseUrl}${image360Url}`,
        });

        viewersRef.current.push(viewer);
      });
    }

    // Cleanup function to destroy all viewers when the component unmounts or updates
    return () => {
      viewersRef.current.forEach((viewer) => {
        // Only attempt to destroy the viewer if it's still present in the DOM
        if (viewer && viewer.container && viewer.container.parentNode) {
          viewer.destroy();
        }
      });
      // Clear the viewersRef array after destroying the viewers
      viewersRef.current = [];
    };
  }, [propertyDetails, baseUrl]);

  const openModal = (imagePath) => {
    setModalImage(`${baseUrl}${imagePath}`);
  };

  const closeModal = () => {
    setModalImage(null);
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
            {propertyDetails.images && propertyDetails.images.map((image, index) => (
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

        {/* 360 Image Section for multiple images */}
        {propertyDetails.image360 && propertyDetails.image360.length > 0 && (
          <div className="gallery-section">
            <h2>360° Images</h2>
            {propertyDetails.image360.map((image360Url, index) => (
              <div key={index} id={`viewer360-${index}`} style={{ width: '500px', height: '500px' }}></div>
            ))}
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
    {/* Ensure that the propertyDetails object has a userId property with user details */}
    <p>Name: {propertyDetails.userId?.fullName}</p> 
  </div>
  <div className="user-phone">
    {/* Ensure that the propertyDetails object has a userId property with user details */}
    <p>Phone: {propertyDetails.userId?.phone}</p>
  </div>
  <textarea placeholder="Write your message here"></textarea>
  <button>Send Message</button>
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
      </div>
    </>
  );
}

export default PropertyDetailsPage;