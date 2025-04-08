import React, { useState, useEffect } from 'react';
import { updateUsername } from '../../services/socketService';

const AvatarOptionsModal = ({
  show = true,
  previewAvatar,
  onGetRandom,
  onSave,
  onClose,
  currentAvatar,
  onGetRandomAvatar,
  onSaveAvatar,
  isGeneratingAvatar = false,
}) => {
  const [username, setUsername] = useState('');

  // Load username from localStorage on component mount
  useEffect(() => {
    const storedUsername = localStorage.getItem('userName');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  if (!show) return null;

  // Support both naming conventions
  const avatarToShow = previewAvatar || currentAvatar;
  const handleGetRandom = onGetRandom || onGetRandomAvatar;
  const handleSave = onSave || onSaveAvatar;

  // Custom save handler to also update username
  const handleSaveWithUsername = () => {
    // Update username if it has changed
    if (username.trim() !== localStorage.getItem('userName')) {
      // Get roomId from URL
      const pathParts = window.location.pathname.split('/');
      const roomId = pathParts[pathParts.length - 1];
      updateUsername(roomId, username.trim());
    }
    // Save avatar
    handleSave();
  };

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-500"></div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 p-4">
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-lg w-full max-w-xs sm:max-w-sm">
        <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Profile Options</h3>

        <div className="flex justify-center mb-3 sm:mb-4">
          {isGeneratingAvatar ? (
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-100 flex items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : avatarToShow ? (
            <img
              src={avatarToShow}
              alt="Avatar preview"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 sm:border-4 border-gray-200"
            />
          ) : (
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm sm:text-base">
              No Avatar
            </div>
          )}
        </div>

        {/* Username input field */}
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Your Name
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your name"
          />
        </div>

        <div className="flex justify-center mb-4">
          <button
            onClick={handleGetRandom}
            className="bg-yellow-500 text-white text-sm sm:text-base px-3 sm:px-4 py-1.5 sm:py-2 rounded hover:bg-yellow-600 flex items-center justify-center min-w-[120px]"
            disabled={isGeneratingAvatar}
          >
            {isGeneratingAvatar ? <LoadingSpinner /> : 'Random Avatar'}
          </button>
        </div>

        <div className="flex justify-center gap-2 sm:gap-3">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 text-sm sm:text-base px-3 sm:px-4 py-1.5 sm:py-2 rounded hover:bg-gray-400"
            disabled={isGeneratingAvatar}
          >
            Cancel
          </button>
          <button
            onClick={handleSaveWithUsername}
            className="bg-blue-500 text-white text-sm sm:text-base px-3 sm:px-4 py-1.5 sm:py-2 rounded hover:bg-blue-600"
            disabled={isGeneratingAvatar || !avatarToShow || !username.trim()}
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvatarOptionsModal;
