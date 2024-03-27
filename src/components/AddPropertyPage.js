import React, { useState } from 'react';
import axios from 'axios';
import './AddPropertyPage.css';

function AddPropertyPage() {
  const [propertyType, setPropertyType] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [municipality, setMunicipality] = useState('');
  const [location, setLocation] = useState('');
  const [area, setArea] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState(null);
  const [image360, setImage360] = useState(null);
  const [video, setVideo] = useState(null);
  const [propertyPapers, setPropertyPapers] = useState(null);
  const [featurePhoto, setFeaturePhoto] = useState(null);
  const [districts, setDistricts] = useState([]); // Added state for dynamic districts based on state selection

  const states = ['Koshi', 'Madesh', 'Bagmati', 'Gandaki', 'Lumbini', 'Sudurpaschim', 'Karnali'];

  const districtOptions = {
    Koshi: ['Taplejung', 'Panchthar', 'Illam', 'Jhapa', 'Morang', 'Sunsari', 'Dhankuta', 'Terhathum', 'Sankhuwasabha', 'Bhojpur', 'Solukhumbu', 'Okhaldhunga', 'Khotang', 'Udayapur'],
    Madesh: ['Saptari', 'Siraha', 'Dhanusa', 'Mahottari', 'Sarlahi', 'Bara', 'Parsa', 'Rautahat'],
    Bagmati: ['Sindhuli', 'Ramechhap', 'Dolakha', 'Sindhupalchowk', 'Kavrepalanchok', 'Lalitpur', 'Bhaktapur', 'Kathmandu', 'Nuwakot', 'Rasuwa', 'Dhading', 'Makwanpur', 'Chitwan'],
    Gandaki: ['Gorkha', 'Lamjung', 'Tanahun', 'Syangja', 'Kaski', 'Manang', 'Mustang', 'Myagdi', 'Nawalpur', 'Parbat', 'Baglung'],
    Lumbini: ['Gulmi', 'Palpa', 'Parasi', 'Rupandehi', 'Kapilvastu', 'Arghakhanchi', 'Pyuthan', 'Rolpa', 'Eastern Rukum', 'Banke', 'Bardiya', 'Dang'],
    Sudurpaschim: ['Bajura', 'Bajhang', 'Achham', 'Doti', 'Kailali', 'Kanchanpur', 'Dadeldhura', 'Baitadi', 'Darchula'],
    Karnali: ['Western Rukum', 'Salyan', 'Dolpa', 'Humla', 'Jumla', 'Kalikot', 'Mugu', 'Surkhet', 'Dailekh', 'Jajarkot'],
  };

  const handleStateChange = (e) => {
    const stateSelected = e.target.value;
    setState(stateSelected);
    setDistricts(districtOptions[stateSelected] || []); // Update districts based on selected state
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('propertyType', propertyType);
    formData.append('state', state);
    formData.append('district', district);
    formData.append('municipality', municipality);
    formData.append('location', location);
    formData.append('area', area);
    formData.append('price', price);
    formData.append('description', description);
  
    if (images) {
      for (let i = 0; i < images.length; i++) {
        formData.append('images', images[i]);
      }
    }
  
    if (image360) {
      for (let i = 0; i < image360.length; i++) {
        formData.append('image360', image360[i]);
      }
    }
  
    if (video) {
      formData.append('video', video);
    }
  
    if (propertyPapers) {
      for (let i = 0; i < propertyPapers.length; i++) {
        formData.append('propertyPapers', propertyPapers[i]);
      }
    }
  
    if (featurePhoto) {
      formData.append('featurePhoto', featurePhoto);
    }
  
    // Retrieve the token from localStorage (or where it is stored)
    const token = localStorage.getItem('token');
  
    try {
      const response = await axios.post('http://localhost:5000/api/properties/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}` // Include the token in the Authorization header
        }
      });
      console.log(response.data);
      alert("Property added successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to add property.");
    }
  };
  

  return (
    <div className="add-property-page">
      <h1>Add New Property</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Property Type:</label>
          <select name="propertyType" value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
            <option value="">Select Property Type</option>
            <option value="Land">Land</option>
            <option value="House">House</option>
          </select>
        </div>

        <div className="form-group">
          <label>State:</label>
          <select name="state" value={state} onChange={handleStateChange}>
            <option value="">Select State</option>
            {states.map((stateName) => (
              <option value={stateName} key={stateName}>{stateName}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>District:</label>
          <select name="district" value={district} onChange={(e) => setDistrict(e.target.value)}>
            <option value="">Select District</option>
            {districts.map((districtName) => (
              <option value={districtName} key={districtName}>{districtName}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Municipality:</label>
          <input 
            type="text" 
            name="municipality" 
            value={municipality} 
            onChange={(e) => setMunicipality(e.target.value)} 
            placeholder="Enter Municipality" 
          />
        </div>

        <div className="form-group">
          <label>Location:</label>
          <input 
            type="text" 
            name="location" 
            value={location} 
            onChange={(e) => setLocation(e.target.value)} 
            placeholder="Enter Location" 
          />
        </div>

        <div className="form-group">
          <label>Area (sq ft):</label>
          <input 
            type="text" 
            name="area" 
            value={area} 
            onChange={(e) => setArea(e.target.value)} 
            placeholder="Enter Area" 
          />
        </div>

        <div className="form-group">
          <label>Price (Rs):</label>
          <input 
            type="text" 
            name="price" 
            value={price} 
            onChange={(e) => setPrice(e.target.value)} 
            placeholder="Enter Price" 
          />
        </div>

        <div className="form-group">
          <label>Description:</label>
          <textarea 
            name="description" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder="Write a description..."
          ></textarea>
        </div>

        <div className="form-group">
          <label>Add Images:</label>
          <input type="file" name="images" multiple onChange={(e) => setImages(e.target.files)} />
        </div>

        <div className="form-group">
          <label>Add 360 Image:</label>
          <input type="file" name="image360" multiple onChange={(e) => setImage360(e.target.files)} />
        </div>

        <div className="form-group">
          <label>Add Video:</label>
          <input type="file" name="video" onChange={(e) => setVideo(e.target.files[0])} />
        </div>

        <div className="form-group">
          <label>Property Papers:</label>
          <input type="file" name="propertyPapers" multiple onChange={(e) => setPropertyPapers(e.target.files)} />
        </div>

        <div className="form-group">
          <label>Feature Photo:</label>
          <input type="file" name="featurePhoto" onChange={(e) => setFeaturePhoto(e.target.files[0])} />
        </div>

        <button type="submit" className="submit-button">Publish</button>
      </form>
    </div>
  );
}

export default AddPropertyPage;


