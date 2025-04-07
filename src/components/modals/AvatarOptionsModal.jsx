import React from 'react';

const AvatarOptionsModal = ({ show, previewAvatar, onGetRandom, onSave, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 p-4">
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-lg w-full max-w-xs sm:max-w-sm">
        <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Avatar Options</h3>

        <div className="flex justify-center mb-3 sm:mb-4">
          {previewAvatar ? (
            <img
              src={previewAvatar}
              alt="Avatar preview"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 sm:border-4 border-gray-200"
            />
          ) : (
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm sm:text-base">
              No Avatar
            </div>
          )}
        </div>

        <div className="flex justify-center mb-3 sm:mb-4">
          <button
            onClick={onGetRandom}
            className="bg-yellow-500 text-white text-sm sm:text-base px-3 sm:px-4 py-1.5 sm:py-2 rounded hover:bg-yellow-600"
          >
            Random Avatar
          </button>
        </div>

        <div className="flex justify-end gap-2 sm:gap-3">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 text-sm sm:text-base px-3 sm:px-4 py-1.5 sm:py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="bg-blue-500 text-white text-sm sm:text-base px-3 sm:px-4 py-1.5 sm:py-2 rounded hover:bg-blue-600"
          >
            Save Avatar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvatarOptionsModal;
