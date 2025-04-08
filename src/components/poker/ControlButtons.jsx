import React from 'react';

const ControlButtons = ({
  showResults,
  onShowResults,
  onStartTimer,
  onResetVotes,
  onOpenTimerPrompt,
  onOpenThemePicker,
  onOpenAvatarOptions,
  allVoted,
}) => {
  return (
    <div className="mt-4 sm:mt-6 md:mt-8 flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 px-2">
      {!showResults && (
        <>
          <button
            onClick={onShowResults}
            className="bg-green-500 text-white text-sm sm:text-base px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg shadow-md hover:bg-green-600 transition-colors"
          >
            Show Results
          </button>
          <button
            onClick={onOpenTimerPrompt}
            className="bg-yellow-500 text-white text-sm sm:text-base px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg shadow-md hover:bg-yellow-600 transition-colors"
          >
            Start Timer
          </button>
        </>
      )}

      {showResults && (
        <button
          onClick={onResetVotes}
          className="bg-blue-500 text-white text-sm sm:text-base px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg shadow-md hover:bg-blue-600 transition-colors"
        >
          New Round
        </button>
      )}
    </div>
  );
};

export default ControlButtons;
