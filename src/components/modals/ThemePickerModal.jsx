import React from 'react';
import { THEME_COLORS } from '../../constants/pokingPokerConstants';

const ThemePickerModal = ({
  show = true,
  currentTheme,
  onThemeChange,
  onThemeSelect,
  onClose,
  themes,
}) => {
  if (!show) return null;

  // Support both direct themes prop and imported themes
  const themesList = themes || THEME_COLORS;

  // Support both onThemeChange and onThemeSelect props
  const handleThemeChange = onThemeSelect || onThemeChange || onClose;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 p-4">
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-lg w-full max-w-xs sm:max-w-sm">
        <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Choose Theme</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
          {themesList.map((themeOption) => (
            <button
              key={themeOption.name}
              onClick={() => handleThemeChange(themeOption)}
              className={`${
                themeOption.bg
              } rounded-lg p-3 sm:p-4 h-16 sm:h-20 text-white text-sm sm:text-base font-bold hover:opacity-80 
                ${
                  currentTheme && currentTheme.name === themeOption.name
                    ? 'ring-2 sm:ring-4 ring-blue-500'
                    : ''
                }`}
            >
              {themeOption.name}
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

export default ThemePickerModal;
