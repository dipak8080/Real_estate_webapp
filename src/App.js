import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './Pages/HomePage';
import BuyPage from './Pages/BuyPage';
import AddPropertyPage from './components/AddPropertyPage';
import ProfilePage from './components/ProfilePage';
import PropertyDetailsPage from './components/PropertyDetailsPage';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Navbar from './components/Navbar';
import AdminDashboard from './components/AdminDashboard';
import UserList from './components/UserList';
import EditUser from './components/EditUser';
import ManageProperties from './components/ManageProperties'; 

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes Without Navbar */}
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<SignUp />} />

          {/* Routes With Navbar */}
          <Route element={<LayoutWithNavbar />}>
            <Route index element={<HomePage />} />
            <Route path="buy" element={<ProtectedRoute><BuyPage /></ProtectedRoute>} />
            <Route path="add-property" element={<ProtectedRoute><AddPropertyPage /></ProtectedRoute>} />
            <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="property/:id" element={<ProtectedRoute><PropertyDetailsPage /></ProtectedRoute>} />
          </Route>

          {/* Admin Dashboard and Related Routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }/>
          <Route path="/admin/properties" element={
            <ProtectedRoute adminOnly={true}>
              <ManageProperties />
            </ProtectedRoute>
          }/>
          <Route path="/admin/users" element={
            <ProtectedRoute adminOnly={true}>
              <UserList />
            </ProtectedRoute>
          }/>
          <Route path="/admin/users/edit/:userId" element={
            <ProtectedRoute adminOnly={true}>
              <EditUser />
            </ProtectedRoute>
          }/>

          {/* Redirect to home if no match found */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

// Layout component with Navbar
function LayoutWithNavbar() {
  return (
    <>
      <Navbar />
      <Outlet /> {/* This will render the matched child route */}
    </>
  );
}

export default App;
