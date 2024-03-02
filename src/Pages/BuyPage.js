// src/pages/BuyPage.js
import React from 'react';
import SearchArea from '../components/SearchArea';
import PropertyList from '../components/PropertyList'; // This will be a new component for listing properties

function BuyPage() {
  return (
    <>
      <SearchArea />
       
      <PropertyList /> 
    </>
  );
}

export default BuyPage;
