import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Viewer } from '@photo-sphere-viewer/core';
import '@photo-sphere-viewer/core/index.css';
import './PropertyDetailsPage.css';

function PropertyDetailsPage() {
  const [propertyDetails, setPropertyDetails] = useState(null);
  const [modalImage, setModalImage] = useState(null);
  const [message, setMessage] = useState(''); // State to hold the message content
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

  const openModal = (imagePath) => {
    setModalImage(`${baseUrl}${imagePath}`);
  };

  const closeModal = () => {
    setModalImage(null);
  };

  // Function to handle message submission
  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return; // Prevent sending empty messages
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/messages',
        {
          propertyId: id,
          content: message,
          recipientId: propertyDetails.userId, // Assuming this ID is part of propertyDetails
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(''); // Clear message input after sending
      alert('Message sent successfully!');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
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
            <p>Name: {propertyDetails.userId?.fullName}</p>
            <p>Phone: {propertyDetails.userId?.phone}</p>
            <form onSubmit={handleMessageSubmit}>
              <textarea
                placeholder="Write your message here"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
              <button type="submit">Send Message</button>
            </form>
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