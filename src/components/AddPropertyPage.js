import React, { useState } from 'react';
import './AddPropertyPage.css';

function AddPropertyPage() {
  const [propertyType, setPropertyType] = useState('');
  const [state, setState] = useState('');
  const [districts, setDistricts] = useState([]);
  const states = ['Koshi', 'Madesh', 'Bagmati', 'Gandaki', 'Lumbini', 'Sudurpaschim', 'Karnali'];

  const handleStateChange = (e) => {
    const stateSelected = e.target.value;
    setState(stateSelected);
    const districtOptions = {
      Koshi: ['Taplejung', 'Panchthar', 'Illam', 'Jhapa', 'Morang', 'Sunsari', 'Dhankuta', 'Terhathum', 'Sankhuwasabha', 'Bhojpur', 'Solukhumbu', 'Okhaldhunga', 'Khotang', 'Udayapur'],
      Madesh: ['Saptari', 'Siraha', 'Dhanusa', 'Mahottari', 'Sarlahi', 'Bara', 'Parsa', 'Rautahat'],
      Bagmati: ['Sindhuli', 'Ramechhap', 'Dolakha', 'Sindhupalchowk', 'Kavrepalanchok', 'Lalitpur', 'Bhaktapur', 'Kathmandu', 'Nuwakot', 'Rasuwa', 'Dhading', 'Makwanpur', 'Chitwan'],
      Gandaki: ['Gorkha', 'Lamjung', 'Tanahun', 'Syangja', 'Kaski', 'Manang', 'Mustang', 'Myagdi', 'Nawalpur', 'Parbat', 'Baglung'],
      Lumbini: ['Gulmi', 'Palpa', 'Parasi', 'Rupandehi', 'Kapilvastu', 'Arghakhanchi', 'Pyuthan', 'Rolpa', 'Eastern Rukum', 'Banke', 'Bardiya', 'Dang'],
      Sudurpaschim: ['Bajura', 'Bajhang', 'Achham', 'Doti', 'Kailali', 'Kanchanpur', 'Dadeldhura', 'Baitadi', 'Darchula'],
      Karnali: ['Western Rukum', 'Salyan', 'Dolpa', 'Humla', 'Jumla', 'Kalikot', 'Mugu', 'Surkhet', 'Dailekh', 'Jajarkot'],
    };
    
    setDistricts(districtOptions[stateSelected] || []);
  };

  return (
    <div className="add-property-page">
      <h1>Property Overview</h1>
      <form>
        {/* Property Type dropdown */}
        <label>Property Type:</label>
        <select name="propertyType" value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
          <option value="">Select Property Type</option>
          <option value="Land">Land</option>
          <option value="House">House</option>
        </select>

        {/* State dropdown */}
        <label>State:</label>
        <select name="state" value={state} onChange={handleStateChange}>
          {states.map((stateName) => (
            <option value={stateName} key={stateName}>{stateName}</option>
          ))}
        </select>

        {/* District dropdown */}
        <label>District:</label>
        <select name="district">
          {districts.length > 0 ? (
            districts.map((district) => (
              <option value={district} key={district}>{district}</option>
            ))
          ) : (
            <option value="">Select a state first</option>
          )}
        </select>

        {/* Location field */}
        <label>Location:</label>
        <input type="text" name="location" placeholder="Enter Location" />

        {/* Area field */}
        <label>Area:</label>
        <input type="text" name="area" placeholder="Enter area in square feet" />

        {/* Price Field */}
        <label>Price:</label>
        <input type="text" name="price" placeholder="Enter Price" />

        {/* Add Image field */}
        <label>Add Image:</label>
        <input type="file" name="image" />

        {/* Add 360 Image field */}
        <label>Add 360 Image:</label>
        <input type="file" name="image360" />

        {/* Property Papers field */}
        <label>Property Papers:</label>
        <input type="file" name="propertyPapers" />

        {/* Description field */}
        <label>Description:</label>
        <textarea name="description" placeholder="Write a description..."></textarea>

        {/* Submit button */}
        <button type="submit">Publish</button>
      </form>
    </div>
  );
}

export default AddPropertyPage;
