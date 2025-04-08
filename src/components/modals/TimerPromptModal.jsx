import React from 'react';

const TimerPromptModal = ({
  show = true,
  duration,
  onDurationChange,
  onStart,
  onClose,
  onStartTimer,
}) => {
  if (!show) return null;

  // Support both naming conventions
  const handleStart = onStart || onStartTimer;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 p-4">
      <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-xs sm:max-w-sm shadow-lg">
        <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Set Timer Duration</h3>
        <div className="mb-3 sm:mb-4">
          <label htmlFor="timerDuration" className="block mb-1 sm:mb-2 text-sm sm:text-base">
            Duration (seconds):
          </label>
          <input
            type="number"
            id="timerDuration"
            value={duration}
            onChange={(e) => onDurationChange(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            min="1"
          />
        </div>
        <div className="flex justify-end gap-2 sm:gap-3">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 text-sm sm:text-base px-3 sm:px-4 py-1.5 sm:py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleStart}
            className="bg-blue-500 text-white text-sm sm:text-base px-3 sm:px-4 py-1.5 sm:py-2 rounded hover:bg-blue-600"
          >
            Start
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimerPromptModal;
