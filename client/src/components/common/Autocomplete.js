import React, { useState, useRef, useEffect } from 'react';

const Autocomplete = ({ suggestions, placeholder, value, onChange, required, label }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    const userInput = e.target.value;
    onChange(userInput);

    // Filter suggestions based on user input
    const filtered = suggestions.filter(
      suggestion => suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
    );
    
    setFilteredSuggestions(filtered);
    setShowSuggestions(true);
    setActiveIndex(-1);
  };

  const handleSuggestionClick = (suggestion) => {
    onChange(suggestion);
    setShowSuggestions(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e) => {
    // Enter key
    if (e.keyCode === 13 && activeIndex !== -1) {
      onChange(filteredSuggestions[activeIndex]);
      setShowSuggestions(false);
      setActiveIndex(-1);
      e.preventDefault();
    }
    // Up arrow
    else if (e.keyCode === 38) {
      if (activeIndex > 0) {
        setActiveIndex(activeIndex - 1);
      }
      e.preventDefault();
    }
    // Down arrow
    else if (e.keyCode === 40) {
      if (activeIndex < filteredSuggestions.length - 1) {
        setActiveIndex(activeIndex + 1);
      }
      e.preventDefault();
    }
  };

  return (
    <div className="mb-4" ref={wrapperRef}>
      {label && <label className="block text-gray-700 font-medium mb-2">{label} {required && <span className="text-red-500">*</span>}</label>}
      <input
        type="text"
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        value={value}
        placeholder={placeholder}
        required={required}
        onFocus={() => setShowSuggestions(true)}
      />
      {showSuggestions && filteredSuggestions.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={index}
              className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${index === activeIndex ? 'bg-gray-100' : ''}`}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Autocomplete;