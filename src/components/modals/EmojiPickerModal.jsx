import React from 'react';
import { EMOJIS } from '../../constants/pokingPokerConstants';

const EmojiPickerModal = ({ show = true, user, onEmojiClick, onEmojiSelect, onClose, emojis }) => {
  if (!show) return null;

  // Support both user and direct emojis props
  const emojisList = emojis || EMOJIS;

  // If onEmojiClick or onEmojiSelect is provided use it, otherwise use onClose
  const handleEmojiClick = (emoji) => {
    if (onEmojiSelect) {
      onEmojiSelect(emoji);
    } else if (onEmojiClick) {
      onEmojiClick(emoji);
    }
    // Don't automatically close if neither handler exists
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 p-4">
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-lg w-full max-w-xs sm:max-w-sm">
        <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">
          {user ? `Send emoji to ${user.name}` : 'Select an emoji'}
        </h3>
        <div className="grid grid-cols-5 gap-2">
          {emojisList.map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleEmojiClick(emoji)}
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
