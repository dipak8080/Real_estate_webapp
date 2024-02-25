import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import BuyPage from './Pages/BuyPage';
import AddPropertyPage from './components/AddPropertyPage';
import ProfilePage from './components/ProfilePage';
import PropertyDetailsPage from './components/PropertyDetailsPage';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<><Navbar /><HomePage /></>} />
        <Route path="/buy" element={<><Navbar /><BuyPage /></>} />
        <Route path="/add-property" element={<><Navbar /><AddPropertyPage /></>} />
        <Route path="/profile" element={<><Navbar /><ProfilePage /></>} />
        <Route path="/property/:propertyId" element={<><Navbar /><PropertyDetailsPage /></>} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
