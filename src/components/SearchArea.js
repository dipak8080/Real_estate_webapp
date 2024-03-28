import React, { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import './SearchArea.css';
import axios from 'axios';

function SearchArea() {
  const [district, setDistrict] = useState('');
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [budget, setBudget] = useState('');
  const [propertyTypeSuggestions, setPropertyTypeSuggestions] = useState([]);
  const [districtSuggestions, setDistrictSuggestions] = useState([]); // New state for district suggestions
  const navigate = useNavigate();

 
  const districtOptions = {
    Koshi: ['Taplejung', 'Panchthar', 'Illam', 'Jhapa', 'Morang', 'Sunsari', 'Dhankuta', 'Terhathum', 'Sankhuwasabha', 'Bhojpur', 'Solukhumbu', 'Okhaldhunga', 'Khotang', 'Udayapur'],
    Madesh: ['Saptari', 'Siraha', 'Dhanusa', 'Mahottari', 'Sarlahi', 'Bara', 'Parsa', 'Rautahat'],
    Bagmati: ['Sindhuli', 'Ramechhap', 'Dolakha', 'Sindhupalchowk', 'Kavrepalanchok', 'Lalitpur', 'Bhaktapur', 'Kathmandu', 'Nuwakot', 'Rasuwa', 'Dhading', 'Makwanpur', 'Chitwan'],
    Gandaki: ['Gorkha', 'Lamjung', 'Tanahun', 'Syangja', 'Kaski', 'Manang', 'Mustang', 'Myagdi', 'Nawalpur', 'Parbat', 'Baglung'],
    Lumbini: ['Gulmi', 'Palpa', 'Parasi', 'Rupandehi', 'Kapilvastu', 'Arghakhanchi', 'Pyuthan', 'Rolpa', 'Eastern Rukum', 'Banke', 'Bardiya', 'Dang'],
    Sudurpaschim: ['Bajura', 'Bajhang', 'Achham', 'Doti', 'Kailali', 'Kanchanpur', 'Dadeldhura', 'Baitadi', 'Darchula'],
    Karnali: ['Western Rukum', 'Salyan', 'Dolpa', 'Humla', 'Jumla', 'Kalikot', 'Mugu', 'Surkhet', 'Dailekh', 'Jajarkot'],
  };

  const handlePropertyTypeChange = (e) => {
    const input = e.target.value;
    setPropertyType(input);

    if (input) {
      setPropertyTypeSuggestions(
        propertyTypeOptions.filter((type) =>
          type.toLowerCase().startsWith(input.toLowerCase())
        )
      );
    } else {
      setPropertyTypeSuggestions([]);
    }
  };

  const handleDistrictChange = (e) => {
    const input = e.target.value;
    setDistrict(input);

    if (!input) {
      setDistrictSuggestions([]);
      return;
    }

    const allDistricts = [].concat(...Object.values(districtOptions));
    const matchedDistricts = allDistricts.filter((districtName) =>
      districtName.toLowerCase().includes(input.toLowerCase())
    );

    setDistrictSuggestions(matchedDistricts);
  };

  const handleSearch = async () => {
    const queryParams = new URLSearchParams({
      ...(district && { district }),
      ...(location && { location }),
      ...(propertyType && { propertyType }),
      ...(budget && { price: budget }),
    });

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(`http://localhost:5000/api/properties/search?${queryParams.toString()}`, config);
      navigate('/buy', { state: { properties: response.data } });
    } catch (error) {
      console.error('Error during search:', error);
      alert('Failed to perform search. Please try again later.');
    }
  };

  const propertyTypeOptions = ['House', 'Land']; // Existing options for property type

  return (
    <div className="search-area-container">
      <div
        className="background-image"
        style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/main.jpg)` }}
      />
      <div className="search-area">
        <input
          type="text"
          placeholder="District"
          value={district}
          onChange={handleDistrictChange}
        />
        {districtSuggestions.length > 0 && (
          <ul className="suggestions-list">
            {districtSuggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => {
                  setDistrict(suggestion);
                  setDistrictSuggestions([]);
                }}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
        <input
          type="text"
          placeholder="Enter Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <input
          type="text"
          placeholder="Property Type"
          value={propertyType}
          onChange={handlePropertyTypeChange}
          autoComplete="off"
        />
        {propertyTypeSuggestions.length > 0 && (
          <ul className="suggestions-list">
            {propertyTypeSuggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => {
                  setPropertyType(suggestion);
                  setPropertyTypeSuggestions([]);
                }}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
        <input
          type="text"
          placeholder="Budget"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />
        <button type="button" onClick={handleSearch}>
          <SearchIcon /> Search
        </button>
      </div>
    </div>
  );
}

export default SearchArea;