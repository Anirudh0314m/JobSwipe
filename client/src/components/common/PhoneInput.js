import React, { useState, useRef } from 'react';
import { countryCodes } from '../../utils/companyData';

const PhoneInput = ({ value, onChange, required }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const dropdownRef = useRef(null);

  // Handle country selection
  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setShowDropdown(false);
    onChange(`${country.code}${phoneNumber}`);
  };

  // Handle phone number input change
  const handlePhoneChange = (e) => {
    const newPhoneNumber = e.target.value.replace(/[^0-9]/g, '');
    setPhoneNumber(newPhoneNumber);
    onChange(`${selectedCountry.code}${newPhoneNumber}`);
  };

  return (
    <div className="mb-4">
      <label className="block text-gray-700 font-medium mb-2">
        Phone Number {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex">
        <div className="relative">
          <button
            type="button"
            className="flex items-center px-3 py-2 border border-gray-300 bg-gray-50 rounded-l-md focus:outline-none"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <span className="mr-2">{selectedCountry.flag}</span>
            <span>{selectedCountry.code}</span>
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          
          {showDropdown && (
            <div 
              ref={dropdownRef}
              className="absolute z-10 mt-1 w-64 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
            >
              {countryCodes.map((country, index) => (
                <div
                  key={index}
                  className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleCountrySelect(country)}
                >
                  <span className="mr-2">{country.flag}</span>
                  <span>{country.country}</span>
                  <span className="ml-auto text-gray-500">{country.code}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <input
          type="tel"
          className="flex-grow p-2 border border-gray-300 border-l-0 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Phone number"
          value={phoneNumber}
          onChange={handlePhoneChange}
          required={required}
        />
      </div>
    </div>
  );
};

export default PhoneInput;