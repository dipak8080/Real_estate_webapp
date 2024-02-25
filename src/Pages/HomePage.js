// src/pages/HomePage.js
import React from 'react';
import SearchArea from '../components/SearchArea';
import FeaturedProperties from '../components/FeaturedProperties';
import ActionSection from '../components/ActionSection';
import '../App.css'; // 

function HomePage() {
  return (
    <div className="HomePage">
      <SearchArea />
      <FeaturedProperties />
      <ActionSection />
    
    </div>
  );
}

export default HomePage;
