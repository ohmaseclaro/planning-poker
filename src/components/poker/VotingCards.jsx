import React from 'react';
import { FIBONACCI_SEQUENCE } from '../../constants/pokingPokerConstants';

const VotingCards = ({ selectedCard, showResults, onCardSelect }) => {
  return (
    <div className="mt-8 flex flex-wrap justify-center gap-2 px-2 max-w-md mx-auto sm:max-w-lg md:max-w-2xl">
      {FIBONACCI_SEQUENCE.map((number) => (
        <button
          key={number}
          onClick={() => onCardSelect(number)}
          className={`w-10 h-14 sm:w-12 sm:h-16 md:w-14 md:h-20 rounded-lg shadow-md flex items-center justify-center text-base sm:text-lg font-bold 
            ${selectedCard === number ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}
            ${showResults ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-100'}
            transition-all duration-200 m-1`}
          disabled={showResults}
        >
          {number}
        </button>
      ))}
    </div>
  );
};

export default VotingCards;
