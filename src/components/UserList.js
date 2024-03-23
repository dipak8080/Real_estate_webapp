import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/admin/users', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
        setUsers(response.data);
      } catch (error) {
        setError('Failed to fetch users');
        console.error(error);
      }
    };

    fetchUsers();
  }, []);

  const handleEdit = (userId) => {
    navigate(`/admin/users/edit/${userId}`);
  };

  const handleDelete = async (userId) => {
    try {
        await axios.delete(`http://localhost:5000/admin/user/${userId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          
      setUsers(users.filter(user => user._id !== userId));
    } catch (error) {
      setError('Failed to delete user');
      console.error(error);
    }
  };

  return (
    <div>
      <h2>User List</h2>
      {error && <p>{error}</p>}
      <ul>
        {users.map(user => (
          <li key={user._id}>
            {user.fullName} - {user.email}
            <button onClick={() => handleEdit(user._id)}>Edit</button>
            <button onClick={() => handleDelete(user._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
