import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Viewer } from '@photo-sphere-viewer/core';
import '@photo-sphere-viewer/core/index.css';
import styles from './PropertyDetailsPage.module.css';
import socket from '../utils/socket'; // Import the socket instance

function PropertyDetailsPage() {
  const [propertyDetails, setPropertyDetails] = useState(null);
  const [modalImage, setModalImage] = useState(null);
  const [message, setMessage] = useState(''); 
  const viewersRef = useRef([]);
  const { id } = useParams();
  const baseUrl = 'http://localhost:5000/uploads/';

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }
        const response = await axios.get(`http://localhost:5000/api/properties/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPropertyDetails(response.data);
      } catch (error) {
        console.error('Error fetching property details:', error);
      }
    };

    fetchPropertyDetails();
  }, [id]);

  useEffect(() => {
    viewersRef.current.forEach((viewer) => viewer.destroy());
    viewersRef.current = [];

    if (propertyDetails && propertyDetails.image360 && propertyDetails.image360.length > 0) {
      propertyDetails.image360.forEach((image360Url, index) => {
        const viewerElement = document.querySelector(`#viewer360-${index}`);
        if (!viewerElement) return;

        const viewer = new Viewer({
          container: viewerElement,
          panorama: `${baseUrl}${image360Url}`,
        });

        viewersRef.current.push(viewer);
      });
    }

    return () => {
      viewersRef.current.forEach((viewer) => {
        if (viewer && viewer.container && viewer.container.parentNode) {
          viewer.destroy();
        }
      });
      viewersRef.current = [];
    };
  }, [propertyDetails, baseUrl]);


  const handleMessageSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return; // Prevent sending empty messages
  
    // Emit the message to the server via socket
    socket.emit('sendMessage', {
      recipientId: propertyDetails.userId, // Assuming this ID is part of propertyDetails
      content: message,
    }, (response) => {
      // Handle server response here
      if (response && response.status === 'success') {
        // Message was sent and handled successfully on the server
        alert('Message sent successfully!');
      } else {
        // Server responded with an error or there was a client-side issue
        alert('Failed to send message. Please try again.');
      }
    });
  
    setMessage(''); // Clear the message input after sending
  };
  

  if (!propertyDetails) {
    return <div>Loading...</div>;
  }

  const openModal = (imagePath) => {
    setModalImage(`${baseUrl}${imagePath}`);
  };
  
  const closeModal = (event) => {
    if (event.target === event.currentTarget) {
      setModalImage(null);
    }
  };

  return (
    <>
      <div className={styles.propertyDetailsContainer}>
        {/* Property Images Section */}
        <div className={styles.gallerySection}>
          <h2>Property Images</h2>
          <div className={styles.galleryContainer}>
            {propertyDetails.images && propertyDetails.images.map((image, index) => (
              <div className={styles.galleryItem} key={index} onClick={() => openModal(image)}>
                <img src={`${baseUrl}${image}`} alt={`Property ${index}`} />
              </div>
            ))}
          </div>
        </div>
  
        {/* Property Papers Section */}
        <div className={styles.gallerySection}>
          <h2>Property Papers</h2>
          <div className={styles.papersContainer}>
            {propertyDetails.propertyPapers && propertyDetails.propertyPapers.map((paper, index) => (
              <div className={styles.galleryItem} key={index} onClick={() => openModal(paper)}>
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
<div className={styles.details}>
  <div className={styles.propertyInfo}>
    <h2>Property Details</h2>
    <p>State: {propertyDetails.state}</p>
    <p>District: {propertyDetails.district}</p>
    <p>Location: {propertyDetails.location}</p>
    <p>Area: {propertyDetails.area}</p>
    <p>Price: {propertyDetails.price}</p>
    <p>Description: {propertyDetails.description}</p>
  </div>
  <div className={styles.contactInfo}>
    <p>Name: {propertyDetails.userId?.fullName}</p>
    <p>Phone: {propertyDetails.userId?.phone}</p>
    <form onSubmit={handleMessageSubmit}>
      <textarea
        className={styles.messageBox} // Use the correct class name from your CSS module
        placeholder="Write your message here"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      ></textarea>
      <button 
        className={styles.sendMessageButton} // Use the correct class name from your CSS module
        type="submit"
      >
        Send Message
      </button>
    </form>
  </div>
</div>

       {/* Modal Popup */}
      {modalImage && (
        <div className={styles.modal} onClick={closeModal}>
        <div className={styles.modalContent} onClick={closeModal}>
          <img src={modalImage} alt="Expanded view" />
          <span className={styles.close} onClick={closeModal}>&times;</span>
        </div>
      </div>
      )}
    </div>
  </>
);
}

export default PropertyDetailsPage;