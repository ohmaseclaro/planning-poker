import React from 'react';
import { EMOJIS } from '../../constants/pokingPokerConstants';

const EmojiPickerModal = ({ show, user, onEmojiClick, onClose }) => {
  if (!show || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 p-4">
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-lg w-full max-w-xs sm:max-w-sm">
        <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Send emoji to {user.name}</h3>
        <div className="grid grid-cols-5 gap-2">
          {EMOJIS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => onEmojiClick(emoji)}
              className="text-xl sm:text-2xl p-1 sm:p-2 hover:bg-gray-100 rounded"
            >
              {emoji}
            </button>
          ))}
        </div>
        <div className="flex justify-end mt-3 sm:mt-4">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 text-sm sm:text-base px-3 sm:px-4 py-1.5 sm:py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmojiPickerModal;
