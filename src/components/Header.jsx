import React from 'react';
import yottaaLogo from '../assets/yottaa_logo.png';

function Header({ isLoginPage = false, setShowThemePicker, setShowAvatarOptions }) {
  return (
    <div className="absolute top-0 left-0 right-0 bg-white shadow-md py-2 px-4 flex justify-between items-center">
      {/* Logo and title */}
      <div className="flex items-center space-x-2">
        <img src={yottaaLogo} alt="Yottaa Logo" className="h-8 sm:h-10" />
        <h1 className="text-gray-800 text-lg sm:text-xl font-bold">Yottaa Planner</h1>
      </div>

      {/* Theme and avatar controls - only shown if not login page */}
      {!isLoginPage && (
        <div className="flex space-x-2">
          <button
            onClick={() => setShowThemePicker(true)}
            className="bg-white p-1.5 sm:p-2 rounded-full shadow-md text-sm sm:text-base border-2 border-purple-500"
            title="Change Theme"
          >
            🎨
          </button>
          <button
            onClick={() => setShowAvatarOptions(true)}
            className="bg-white p-1.5 sm:p-2 rounded-full shadow-md text-sm sm:text-base border-2 border-purple-500"
            title="Change Avatar"
          >
            👤
          </button>
        </div>
      )}
    </div>
  );
}

export default Header;
