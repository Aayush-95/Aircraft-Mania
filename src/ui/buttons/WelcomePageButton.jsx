import React from 'react';

const HomePageButton = ({ children, onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors duration-150 ${className}`}
    >
      {children}
    </button>
  );
};

export default HomePageButton;