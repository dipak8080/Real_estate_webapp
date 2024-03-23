// src/components/AdminDashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css'; // Import the CSS file

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="dashboard-buttons">
        <button onClick={() => navigate('/admin/users')}>Manage Users</button>
        <button onClick={() => navigate('/admin/properties')}>Manage Properties</button>
        <button onClick={() => navigate('/admin/manage-featured-properties')}>Manage Featured Properties</button>
      </div>
      {/* You can include any other overview information or quick actions here */}
    </div>
  );
};

export default AdminDashboard;
