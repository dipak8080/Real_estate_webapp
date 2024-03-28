// src/components/EditUser.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './EditUser.module.css'; // Import the CSS module

const EditUser = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/admin/user/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setFormData(response.data);
      } catch (error) {
        setError('Failed to fetch user details');
        console.error(error);
      }
    };
    fetchUserDetails();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/admin/user/${userId}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      navigate('/admin/users');
    } catch (error) {
      setError('Failed to update user');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.editUserForm}>
      <h2 className={styles.editUserTitle}>Edit User</h2>
      {error && <p className={styles.editUserError}>{error}</p>}
      <input
        className={styles.editUserInput}
        type="text"
        name="fullName"
        placeholder="Full Name"
        value={formData.fullName}
        onChange={handleChange}
        required
      />
      <input
        className={styles.editUserInput}
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        className={styles.editUserInput}
        type="tel"
        name="phone"
        placeholder="Phone"
        value={formData.phone}
        onChange={handleChange}
        required
      />
      <input
        className={styles.editUserInput}
        type="text"
        name="location"
        placeholder="Location"
        value={formData.location}
        onChange={handleChange}
        required
      />
      <button type="submit" className={styles.editUserSubmitBtn}>Submit</button>
    </form>
  );
};

export default EditUser;